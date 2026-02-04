import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const methods = await locals.pb.collection("users").listAuthMethods();

    methods.authProviders.sort((a, b) => {
        const providerOrder = ["google", "microsoft", "apple"];
        return providerOrder.indexOf(a.name) - providerOrder.indexOf(b.name);
    });

    return {
        methods,
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const token = form.get("token");
        if (!token || typeof token !== "string") {
            throw redirect(303, "/auth");
        }
        cookies.set("pb_auth", JSON.stringify({ token: token }), {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });
        throw redirect(303, "/");
    },
} satisfies Actions;
