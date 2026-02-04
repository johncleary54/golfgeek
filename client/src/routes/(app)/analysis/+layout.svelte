<script lang="ts">
    import StatCard from "./components/StatCard.svelte";
    import { page } from "$app/stores";
    import type { LayoutData } from "./$types";
    import { fade } from "svelte/transition";

    $: currPage = $page.url.pathname;

    export let data: LayoutData;

    const TOUR_AVG_FAIRWAY_ACCURACY = 65;
    const TOUR_AVG_STROKES_GAINED = 0;
    const TOUR_AVG_POOR_TEE_SHOTS = 4.7;
    const TOUR_AVG_PENALTY_PERCENTAGE = 0.88;
</script>

<!-- HERO -->
<div class="h-full w-full bg-neutral-900 lg:h-[144px]">
    <!-- <div class="max-w-screen-2xl px-6 pt-8 pb-8 mx-auto text-white">
        <div class="grid lg:grid-cols-2 gap-6">
            <div class="flex items-center">
                <h6 class="font-medium lg:text-2xl text-xl">
                    This could be some csopy talking to the user about some of
                    their recent stats and how they are performing.
                </h6>
            </div>
            <div class="flex gap-4">
                <div class="flex flex-col gap-4 flex-1 py-2 px-4">
                    <p class="text-neutral-300 text-sm">Top area to work on</p>
                    <div class="flex justify-between items-center">
                        <div
                            class="flex flex-col gap-2 pl-4 border-l border-neutral-800"
                        >
                            <p>Fairway Accuracy</p>
                            <p class="text-xl">+0.34</p>
                        </div>
                        <div
                            class="p-2 rounded-lg bg-secondary-600 hover:bg-secondary-500 group hidden sm:block"
                        >
                            <div
                                class="group-hover:-rotate-12 transition-all ease-in-out duration-100"
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-4 flex-1 py-2 px-4">
                    <p class="text-neutral-300 text-sm">Top area to work on</p>
                    <div class="flex justify-between items-center">
                        <div
                            class="flex flex-col gap-2 pl-4 border-l border-neutral-800"
                        >
                            <p>Fairway Accuracy</p>
                            <p class="text-xl">+0.34</p>
                        </div>
                        <div
                            class="p-2 rounded-lg bg-secondary-600 hover:bg-secondary-500 group hidden sm:block"
                        >
                            <div
                                class="group-hover:-rotate-12 transition-all ease-in-out duration-100"
                            >
                                <ArrowUpRight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
</div>

<div class="relative mx-auto max-w-screen-2xl px-6 py-6 lg:-top-[6.5rem] lg:py-0">
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <!-- TODO: We can map StatCard once we are getting dynamic data -->
        <StatCard
            showImage
            title="Strokes gained tot"
            tooltip="Player's average strokes gained or lost against all facets of their game"
            change={data.averageSGForAllRounds - TOUR_AVG_STROKES_GAINED || 0}
            stat={data.averageSGForAllRounds || 0}
            roundInfo="{data.roundsAmount || 0} Round{data.roundsAmount > 1 ? 's' : ''}"
            pgaTour="Tour Average - {TOUR_AVG_STROKES_GAINED.toFixed(2)}"
        />

        <StatCard
            title="Fairway Accuracy"
            tooltip="The percentage of tee shots that hit the fairway"
            change={data.fairwayAccuracyPercentage - TOUR_AVG_FAIRWAY_ACCURACY || 0}
            stat={data.fairwayAccuracyPercentage || 0}
            roundInfo="{data.roundsAmount || 0} Round{data.roundsAmount > 1 ? 's' : ''}"
            pgaTour="Tour Average - {TOUR_AVG_FAIRWAY_ACCURACY.toFixed(2)}%"
            percent
        />

        <StatCard
            title="Poor Tee Shot %"
            tooltip="The percentage of tee shots that gain -0.5 strokes or less"
            change={data.poorTeeShotsPercentage - TOUR_AVG_POOR_TEE_SHOTS || 0}
            stat={data.poorTeeShotsPercentage || 0}
            roundInfo="{data.roundsAmount || 0} Round{data.roundsAmount > 1 ? 's' : ''}"
            pgaTour="Tour Average - {TOUR_AVG_POOR_TEE_SHOTS.toFixed(2)}%"
            percent
            reverseColors
        />

        <StatCard
            title="Penalty %"
            tooltip="The percentage of tee shots that are hit into penalties"
            change={data.penaltyPercentage - TOUR_AVG_PENALTY_PERCENTAGE || 0}
            stat={data.penaltyPercentage || 0}
            roundInfo="{data.roundsAmount || 0} Round{data.roundsAmount > 1 ? 's' : ''}"
            pgaTour="Tour Average - {TOUR_AVG_PENALTY_PERCENTAGE.toFixed(2)}%"
            percent
            reverseColors
        />
    </div>

    <!-- NAV -->
    <nav class="py-6" aria-label="Tabs">
        <div
            class="flex overflow-auto whitespace-nowrap border-b border-neutral-100 text-neutral-600"
        >
            <a
                class="cursor-pointer p-3 text-sm font-medium transition-all duration-300 ease-in-out {currPage ===
                    '/analysis' && 'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/analysis${$page.url.search || ""}`}
                title="Overview"
            >
                Overview
            </a>
            <a
                class="cursor-pointer p-3 text-sm font-medium transition-all duration-300 ease-in-out {currPage ===
                    '/analysis/off-the-tee' && 'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/analysis/off-the-tee${$page.url.search || ""}`}
                title="Off the tee"
            >
                Off the tee
            </a>
            <a
                class="cursor-pointer p-3 text-sm font-medium transition-all duration-300 ease-in-out {currPage ===
                    '/analysis/approach' && 'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/analysis/approach${$page.url.search || ""}`}
            >
                Approach
            </a>
            <a
                class="cursor-pointer p-3 text-sm font-medium transition-all duration-300 ease-in-out {currPage ===
                    '/analysis/short-game' && 'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/analysis/short-game${$page.url.search || ""}`}
                title="Short game"
            >
                Short game
            </a>
            <a
                class="cursor-pointer p-3 text-sm font-medium transition-all duration-300 ease-in-out {currPage ===
                    '/analysis/putting' && 'border-primary-500 text-primary-600 border-b-2 '}"
                href={`/analysis/putting${$page.url.search || ""}`}
                title="Putting"
            >
                Putting
            </a>
        </div>
    </nav>

    {#key $page.url}
        <div in:fade={{ duration: 200, delay: 100 }}>
            <slot />
        </div>
    {/key}
</div>
