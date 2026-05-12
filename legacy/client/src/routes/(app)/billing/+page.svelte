<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import { toast } from "$lib/components/toast/toast.js";
    import StepIcon from "$lib/icons/StepIcon.svelte";
    import type { ActionData, PageData } from "./$types.js";

    export let data: PageData;
    export let form: ActionData;

    $: if (form?.error) {
        toast({ message: form.error, type: "error" });
    }
</script>

<div class="py-8 sm:py-14">
    <div class="mx-auto max-w-2xl px-6 lg:px-8">
        <div class="mx-auto mt-6 max-w-2xl sm:text-center">
            <h2 class="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                Hello, {data.email}! {data.subscribed
                    ? "Thanks for subscribing!"
                    : "Subscribe to access all features."}
            </h2>
            <p class="mt-6 text-lg leading-8 text-gray-500">
                Unlock the full power of the Golfgeek platform with the Elite Golfer Plan
            </p>
        </div>
        <div
            class="mx-auto mt-10 max-w-lg rounded-xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:max-w-none
            {data.subscribed ? 'ring-green-700' : 'bg-white ring-gray-100'}
            "
        >
            <div class="p-4">
                <h3 class="text-2xl font-semibold tracking-tight text-gray-900">
                    Elite Golfer Plan
                </h3>
                <p class="text-sm leading-8 text-gray-500">Cancel anytime. No questions asked.</p>
            </div>
            <hr />
            <div class="p-4">
                <p class="mt-4 flex items-baseline gap-x-2">
                    <span class="text-5xl font-bold tracking-tight text-gray-900">€20</span>
                    <span class="text-xl font-medium leading-6 text-gray-500">/month</span>
                </p>
                {#if !data.subscribed}
                    <form class="mt-6 w-full" action="?/checkout" method="POST">
                        <Button class="w-full">Subscribe</Button>
                    </form>
                {:else}
                    <form class="mt-6 w-full" action="?/portal" method="POST">
                        <Button class="w-full">Cancel</Button>
                    </form>
                {/if}
                <ul class="mt-6 flex flex-col gap-4">
                    <li class="flex items-center gap-2">
                        <StepIcon /> Strokes Gained Analysis vs PGA Tour
                    </li>
                    <li class="flex items-center gap-2">
                        <StepIcon />Detailed & Fast Round Entry
                    </li>
                    <li class="flex items-center gap-2">
                        <StepIcon />Strokes Gained Predictor
                    </li>
                </ul>
                <form action="?/portal" method="post" class="mt-6">
                    <span class="text-xs leading-5 text-gray-600">
                        <button class="text-sm font-semibold leading-5 text-gray-800">
                            Manage
                        </button>
                        your subscription plan and billing information.
                    </span>
                </form>
            </div>
        </div>
    </div>
</div>
