// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import PocketBase from "pocketbase";
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            pb: PocketBase;
            user: {
                id: string;
                email: string;
                stripeId: string;
                subscribed: boolean;
            };
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
