import { redirect, type Handle } from "@sveltejs/kit";
import type { User } from "./lib/types";
import { building } from "$app/environment";
import { API_URI } from "$env/static/private";
import PocketBase from "pocketbase";
import { perf } from "$lib/server/logging.service";
import { checkSubscription } from "$lib/server/stripe.service";

/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {
    const end = perf("Auth");
    event.locals.user = {
        id: "",
        email: "",
        stripeId: "",
        subscribed: false,
    };
    event.locals.pb = new PocketBase(API_URI).autoCancellation(false);

    const isAuth = event.url.pathname === "/auth";
    if (isAuth || building) {
        event.cookies.set("pb_auth", "");
        return resolve(event);
    }

    // load the store data from the request cookie string
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") ?? "");

    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        event.locals.pb.authStore.isValid &&
            (await event.locals.pb.collection("users").authRefresh());

        const user = event.locals.pb.authStore.model as unknown as User;
        event.locals.user.id = user.id;
        event.locals.user.email = user.email;
        event.locals.user.stripeId = user.stripeId;
        const isSubscribed = await checkSubscription(event.locals.pb, user.stripeId);
        event.locals.user.subscribed = isSubscribed;
    } catch (_) {
        console.info("Auth refresh failed");
        event.locals.pb.authStore.clear();
    }

    if (!event.locals.user.id) {
        throw redirect(303, "/auth");
    }

    if (!event.locals.user.subscribed && !event.url.pathname.startsWith("/billing")) {
        throw redirect(303, "/billing");
    }

    if (event.locals.user.id && event.url.pathname === "/") {
        throw redirect(303, "/analysis");
    }

    const response = await resolve(event);

    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.append(
        "set-cookie",
        event.locals.pb.authStore.exportToCookie({
            sameSite: "lax",
        }),
    );

    end();
    return response;
};
