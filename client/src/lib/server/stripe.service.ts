import { STRIPE_API_KEY } from "$env/static/private";
import Stripe from "stripe";
import type PocketBase from "pocketbase";
import { safe, type Safe } from "./safe.service";
import type { User } from "$lib/types";

export function getStripe(): Stripe {
    const stripe = new Stripe(STRIPE_API_KEY, {
        apiVersion: "2022-11-15",
        typescript: true,
    });
    return stripe;
}

/**
 * Create a stripe user
 * @param {PocketBase} pb
 * @param {string} userId
 * @param {string} email
 * @returns {Promise<Safe<string>>}
 */
export async function createStripeUser(
    pb: PocketBase,
    userId: string,
    email: string,
): Promise<Safe<string>> {
    const stripe = getStripe();
    const customer = await safe(stripe.customers.create({ email, metadata: { userId } }));
    if (!customer.success) {
        return { success: false, error: "Failed to create customer" };
    }
    const user = await safe(
        pb.collection("users").update<User>(userId, {
            stripeId: customer.data.id,
        }),
    );
    if (!user.success) {
        return { success: false, error: "User not found" };
    }
    return { success: true, data: user.data.stripeId };
}

/**
 * Check subscription status
 * @param {PocketBase} pb - PocketBase instance
 * @param {string} stripeId - Stripe customer id
 * @returns {Promise<boolean>}
 */
export async function checkSubscription(pb: PocketBase, stripeId: string): Promise<boolean> {
    if (!stripeId) {
        return false;
    }
    const user = await safe(
        pb.collection("users").getFirstListItem<User>(`stripeId = "${stripeId}"`),
    );
    if (!user.success) {
        return false;
    }
    if (user.data.subscriptionEnd && new Date(user.data.subscriptionEnd) > new Date()) {
        return true;
    }
    if (user.data.subscriptionCheck && new Date(user.data.subscriptionCheck) > new Date()) {
        return false;
    }

    const stripe = getStripe();

    const subscriptions = await safe(
        stripe.subscriptions.list({
            customer: stripeId,
        }),
    );
    if (!subscriptions.success) {
        return false;
    }
    const isSubscribed = subscriptions.data.data.find(
        (subscription) => subscription.status === "active",
    );
    if (isSubscribed) {
        const periodEnd = isSubscribed.current_period_end;
        const periodEndPlusTwoDays = new Date(periodEnd * 1000);
        periodEndPlusTwoDays.setDate(periodEndPlusTwoDays.getDate() + 2);
        await safe(
            pb.collection("users").update<User>(user.data.id, {
                subscriptionEnd: periodEndPlusTwoDays,
            }),
        );
        return true;
    }

    const nowPlusOneHour = new Date();
    nowPlusOneHour.setHours(nowPlusOneHour.getHours() + 1);
    await safe(
        pb.collection("users").update<User>(user.data.id, {
            subscriptionCheck: nowPlusOneHour,
        }),
    );
    return false;
}

/**
 * Clear subscription check
 * @param {PocketBase} pb - PocketBase instance
 * @param {string} userId - User id
 * @returns {Promise<void>}
 */
export async function clearSubscriptionCheck(pb: PocketBase, userId: string): Promise<Safe<User>> {
    return await safe(
        pb.collection("users").update<User>(userId, {
            subscriptionCheck: null,
        }),
    );
}
