<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import FilterLinesIcon from "$lib/icons/FilterLinesIcon.svelte";
    import RefreshIcon from "$lib/icons/RefreshIcon.svelte";

    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
    } from "$lib/components/accordion";
    import GeneralFilter from "./GeneralFilter.svelte";
    import RoundTypeFilter from "./RoundTypeFilter.svelte";
    import WeatherFilter from "./WeatherFilter.svelte";
    import CourseConditionsFilter from "./CourseConditionsFilter.svelte";
    // import RoundScoreFilter from "./RoundScoreFilter.svelte";
    // import QuickActionsFilter from "./QuickActionsFilter.svelte";
    import { onMount } from "svelte";
    import { applyFilters, mountFilters, resetFilters, selectedFilters } from "./filterService";
    import XIcon from "$lib/icons/XIcon.svelte";
    import { formatSingleWordOrCamelCase } from "$lib/utils";
    import { page } from "$app/stores";
    import { createDialog } from "@melt-ui/svelte";
    import { fade, fly } from "svelte/transition";

    /**
     * TODO: Hidden Filters, fix at later date
     */

    const advancededComponents = [
        {
            title: "Round Type",
            component: RoundTypeFilter,
        },
        {
            title: "Weather conditions",
            component: WeatherFilter,
        },
        {
            title: "Course conditions",
            component: CourseConditionsFilter,
        },
        // {
        //     title: "Score",
        //     component: RoundScoreFilter,
        // },
        // {
        //     title: "Quick actions",
        //     component: QuickActionsFilter,
        // },
    ];

    onMount(() => {
        mountFilters($page.url.searchParams);
    });
    const {
        elements: { trigger, overlay, content, close, portalled },
        states: { open },
    } = createDialog();
</script>

<button {...$trigger} use:trigger>
    <div class="rounded-lg bg-neutral-800/60 p-2.5 text-white">
        <FilterLinesIcon />
    </div>
</button>
<div {...$portalled} use:portalled>
    {#if $open}
        <div
            {...$overlay}
            use:overlay
            class="fixed inset-0 z-50 bg-black/50"
            transition:fade={{ duration: 150 }}
        />
        <div
            {...$content}
            use:content
            class="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[600px]
            flex-col bg-neutral-50 shadow-lg focus:outline-none"
            transition:fly={{
                x: 600,
                duration: 300,
                opacity: 1,
            }}
        >
            <div
                class="abosulte shadow-component top-0 z-10 w-full border-b border-neutral-100 bg-white p-6"
            >
                <div class="flex">
                    <div class="whitespace-nowrap text-xl font-medium">Global Filter</div>

                    <button
                        {...$close}
                        use:close
                        aria-label="Close"
                        class="text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400 focus:ring-magnum-400 absolute right-[10px]
                top-[24px] inline-flex h-6 w-6 appearance-none
                items-center justify-center rounded-full focus:outline-none
                focus:ring-2"
                    >
                        <XIcon />
                    </button>
                </div>

                <div class="flex flex-wrap gap-2 pr-2 text-xs text-neutral-600">
                    {#each Object.entries($selectedFilters) as [key, value]}
                        {#if value}
                            {#if typeof value === "object" && Object.keys(value).length > 0}
                                {#each Object.entries(value) as [subKey, subValue]}
                                    <!-- This removes id from nested objects since we don't need to 
                                    show the user the id as a tag. This being the case as we always expect
                                    to have an id in the nested object.  -->
                                    {#if subKey !== "id" && subValue !== ""}
                                        <span
                                            class="bg-primary-100 text-primary-700 cursor-default rounded-full px-2.5 py-1"
                                        >
                                            {formatSingleWordOrCamelCase(key)}
                                            [{subKey}] : {subValue}
                                        </span>
                                    {/if}
                                {/each}
                            {:else if typeof value !== "object" && value !== ""}
                                <span
                                    class="bg-primary-100 text-primary-700 cursor-default rounded-full px-2.5 py-1"
                                >
                                    {formatSingleWordOrCamelCase(key)} : {value}
                                </span>
                            {/if}
                        {/if}
                    {/each}
                </div>
            </div>

            <div class="mb-24 space-y-2 overflow-y-scroll py-6">
                <div class="px-6">
                    <h2 class="pb-6 text-xs uppercase text-neutral-600">General</h2>
                    <GeneralFilter />
                </div>

                <div class="px-6">
                    <h2 class="pb-2 text-xs uppercase text-neutral-600">Advanced</h2>
                    <Accordion type="multiple" collapsible>
                        {#each advancededComponents as item}
                            <AccordionItem value={item.title}>
                                <AccordionTrigger class="text-base">
                                    {item.title}
                                </AccordionTrigger>
                                <AccordionContent class="overflow-visible px-1 text-black">
                                    <svelte:component this={item.component} />
                                </AccordionContent>
                            </AccordionItem>
                        {/each}
                    </Accordion>
                </div>
            </div>
            <div
                class="shadow-component absolute bottom-0 z-10 w-full border-t border-neutral-100 bg-white p-6"
            >
                <div class="flex w-full justify-between">
                    <Button
                        variant="secondary"
                        iconPosition="right"
                        class="disabled:text-neutral-400"
                        on:click={resetFilters}
                        disabled={Object.keys($selectedFilters).length === 0 ||
                            Object.values($selectedFilters).every((value) => value === "")}
                    >
                        Reset Filter <svelte:fragment slot="icon">
                            <RefreshIcon />
                        </svelte:fragment>
                    </Button>
                    <Button type="submit" on:click={() => applyFilters($selectedFilters)}>
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    {/if}
</div>
