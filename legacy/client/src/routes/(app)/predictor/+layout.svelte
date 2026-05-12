<script lang="ts">
    import { page } from "$app/stores";
    import TooltipContent from "$lib/components/TooltipContent.svelte";
    import InfoIcon from "$lib/icons/InfoIcon.svelte";
    import { Tooltip } from "radix-svelte";
    import Modal from "$lib/components/Modal.svelte";
    import HowItWorksModal from "./components/HowItWorksModal.svelte";

    $: currPage = $page.url.pathname;

    let open = false;
</script>

{#if open}
    <Modal on:close={() => (open = false)}>
        <HowItWorksModal on:close={() => (open = false)} />
    </Modal>
{/if}
<div class="relative mx-auto max-w-screen-2xl px-6 py-6">
    <header class="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <h1 class="text-2xl font-medium text-neutral-900" title="Strokes Gained Predictor">
            Strokes Gained Predictor
        </h1>
        <div class="flex gap-4">
            <div class="flex items-center gap-2 align-middle">
                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger>
                            <div class="sr-only">Info</div>
                            <div class="text-primary-500">
                                <InfoIcon />
                            </div>
                        </Tooltip.Trigger>
                        <TooltipContent class="max-w-[250px]">How it works</TooltipContent>
                    </Tooltip.Root>
                </Tooltip.Provider>
                <button
                    class="text-primary-500 cursor-pointer font-medium"
                    on:click={() => (open = true)}
                    on:keydown={() => (open = false)}
                >
                    How it works
                </button>
            </div>
        </div>
    </header>

    <nav class="py-6" aria-label="Tabs">
        <div
            class="flex overflow-auto whitespace-nowrap border-b border-neutral-100 text-neutral-600"
        >
            <a
                class="cursor-pointer p-3 text-sm font-medium {currPage ===
                    '/predictor/off-the-tee' && 'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/predictor/off-the-tee${$page.url.search || ""}`}
                title="Off the tee"
            >
                Off the tee
            </a>

            <a
                class="cursor-pointer p-3 text-sm font-medium {currPage === '/predictor/approach' &&
                    'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/predictor/approach${$page.url.search || ""}`}
                title="Approach"
            >
                Approach
            </a>

            <a
                class="cursor-pointer p-3 text-sm font-medium {currPage ===
                    '/predictor/short-game' && 'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/predictor/short-game${$page.url.search || ""}`}
                title="Short game"
            >
                Short game
            </a>
            <a
                class="cursor-pointer p-3 text-sm font-medium {currPage === '/predictor/putting' &&
                    'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/predictor/putting${$page.url.search || ""}`}
                title="Putting"
            >
                Putting
            </a>
        </div>
    </nav>

    <slot />
</div>
