<script lang="ts">
    import LineChart from "./components/LineChart.svelte";
    import BarCard from "$lib/components/BarCard.svelte";
    import type { PageData } from "./$types";
    import { createTabs, melt, type CreateTabsProps } from "@melt-ui/svelte";
    import { browser } from "$app/environment";
    import { writable } from "svelte/store";
    import { AnalysisTab } from "$lib/types";

    export let data: PageData;

    let initialTab = browser
        ? localStorage.getItem("tab-overview") ?? AnalysisTab.StrokesGained
        : AnalysisTab.StrokesGained;
    let activeTab = writable(initialTab);

    const handleChangeTab: CreateTabsProps["onValueChange"] = ({ next }) => {
        if (browser) {
            localStorage.setItem("tab-overview", next);
        }

        return next;
    };

    const {
        elements: { root, list, content, trigger },
    } = createTabs({
        onValueChange: handleChangeTab,
        value: activeTab,
    });

    const roundTabData = [
        {
            label: "Total",
            tooltip: "The average total strokes gained per round versus tour average",
            value: data.averageSGForAllRounds || 0,
            border: true,
        },
        {
            label: "Off the tee",
            tooltip: "The average strokes gained off the tee per round",
            value: data.averageSGOTTForAllRounds || 0,
            border: false,
        },
        {
            label: "Approach",
            tooltip: "The average strokes gained approach per round",
            value: data.averageSGApproachForAllRounds || 0,
            border: false,
        },
        {
            label: "Short game",
            tooltip: "The average strokes gained short game per round",
            value: data.averageSGShortGameForAllRounds || 0,
            border: false,
        },
        {
            label: "Putting",
            tooltip: "The average strokes gained putting per round",
            value: data.averageSGPuttingForAllRounds || 0,
            border: false,
        },
    ];
</script>

<div use:melt={$root}>
    <div
        use:melt={$list}
        class="bg-neutral-75 mb-4 inline-flex h-12 items-center justify-center rounded-lg p-1 text-neutral-600"
    >
        <div
            class="ring-offset-background focus-visible:ring-primary-600 inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
            use:melt={$trigger(AnalysisTab.StrokesGained)}
        >
            Strokes Gained
        </div>
        <div
            class="ring-offset-background focus-visible:ring-primary-600 inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
            use:melt={$trigger(AnalysisTab.Scoring)}
        >
            Scoring
        </div>
    </div>

    <div
        use:melt={$content(AnalysisTab.StrokesGained)}
        class="ring-offset-background focus-visible:ring-primary-600 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
        <div class="grid gap-6 lg:grid-cols-4">
            <BarCard
                title="Average Strokes Gained"
                subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                barData={roundTabData}
            />

            <div
                class="shadow-component h-fit rounded-lg border border-neutral-100 bg-white lg:col-span-3"
            >
                <header class="border-b border-neutral-100 px-6 py-4">
                    <h1 class="text-xl font-medium">Strokes gained</h1>
                    <p class="text-sm text-neutral-600">
                        {data.roundsAmount} Round{data.roundsAmount > 1 ? "s" : ""}
                    </p>
                </header>
                <div class="h-[300px] w-full px-2 py-2 md:px-6 md:py-4 lg:h-[433px]">
                    <LineChart
                        min={Math.ceil(Math.min(...data.overviewChartData) - 1)}
                        max={Math.floor(Math.max(...data.overviewChartData) + 1)}
                        sgData={data.overviewChartData}
                        labels={data.overviewLabels}
                    />
                </div>
            </div>
        </div>
    </div>
    <div
        use:melt={$content(AnalysisTab.Scoring)}
        class="ring-offset-background focus-visible:ring-primary-600 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
        <div class="grid gap-6 lg:grid-cols-2">
            <BarCard
                title="Round Scoring"
                subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                barData={[
                    {
                        label: "First 6 Holes",
                        tooltip: "The average score for the first 6 holes",
                        value: data.averageFirst6HolesScore,
                        border: false,
                    },
                    {
                        label: "Middle 6 Holes",
                        tooltip: "The average score for the middle 6 holes",
                        value: data.averageMiddle6HolesScore,
                        border: false,
                    },
                    {
                        label: "Final 6 Holes",
                        tooltip: "The average score for the final 6 holes",
                        value: data.averageLast6HolesScore,
                        border: false,
                    },
                ]}
                switchColors
            />
            <BarCard
                title="Hole Scoring"
                subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                barData={[
                    {
                        label: "Par 3",
                        tooltip: "Average score to par on all par 3 holes",
                        value: data.averagePar3HolesScore,
                        border: false,
                        origin: 3,
                    },
                    {
                        label: "Par 4",
                        tooltip: "Average score to par on all par 4 holes",
                        value: data.averagePar4HolesScore,
                        border: false,
                        origin: 4,
                    },
                    {
                        label: "Par 5",
                        tooltip: "Average score to par on all par 5 holes",
                        value: data.averagePar5HolesScore,
                        border: false,
                        origin: 5,
                    },
                ]}
                switchColors
            />
        </div>
    </div>
</div>
