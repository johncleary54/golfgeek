import { clearSubscriptionCheck, createStripeUser, getStripe } from "$lib/server/stripe.service";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { PUBLIC_DOMAIN } from "$env/static/public";
import { STRIPE_PRICE_ID } from "$env/static/private";

export const load = (({ locals }) => {
    return {
        subscribed: locals.user.subscribed,
    };
}) satisfies PageServerLoad;

export const actions = {
    checkout: async ({ locals }) => {
        const check = await clearSubscriptionCheck(locals.pb, locals.user.id);
        if (!check.success) {
            return fail(500, { error: "Failed to clear subscription check" });
        }
        const stripe = getStripe();
        let stripeId = locals.user.stripeId;
        if (!stripeId) {
            const customerId = await createStripeUser(locals.pb, locals.user.id, locals.user.email);
            if (!customerId.success) {
                return fail(500, { error: "Failed to create customer" });
            }
            stripeId = customerId.data;
        }

        const schemaStripeId = z.string().min(1);
        const stripeSchema = schemaStripeId.safeParse(stripeId);
        if (!stripeSchema.success) {
            return fail(500, { error: "Invalid stripeId" });
        }

        const price = await stripe.prices.retrieve(STRIPE_PRICE_ID);
        const session = await stripe.checkout.sessions.create({
            customer: stripeSchema.data,
            billing_address_collection: "auto",
            line_items: [
                {
                    price: price.id,
                    // For metered billing, do not pass quantity
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${PUBLIC_DOMAIN}/billing/info?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${PUBLIC_DOMAIN}/billing/info?status=error`,
        });
        if (!session.url) {
            return fail(500, { error: "Session URL not found" });
        }
        throw redirect(303, session.url);
    },
    portal: async ({ locals }) => {
        const check = await clearSubscriptionCheck(locals.pb, locals.user.id);
        if (!check.success) {
            return fail(500, { error: "Failed to clear subscription check" });
        }
        const stripe = getStripe();
        let stripeId = locals.user.stripeId;
        if (!stripeId) {
            const customerId = await createStripeUser(locals.pb, locals.user.id, locals.user.email);
            if (!customerId.success) {
                return fail(500, { error: "Failed to create customer" });
            }
            stripeId = customerId.data;
        }
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeId,
            return_url: `${PUBLIC_DOMAIN}/billing`,
        });

        if (!portalSession.url) {
            return fail(500, { error: "Portal URL not found" });
        }
        throw redirect(303, portalSession.url);
    },
} satisfies Actions;
