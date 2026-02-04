<script lang="ts">
    import LineChart from "../components/LineChart.svelte";
    import BarCard from "$lib/components/BarCard.svelte";
    import Table from "../components/Table.svelte";

    import KpMetricsBar from "../components/KPMetricsBar.svelte";
    import type { PageData } from "./$types";
    import BarCardToggle from "$lib/components/BarCardToggle.svelte";
    import { showRoundOrShotData } from "$lib/utils";
    import { createTabs, melt, type CreateTabsProps } from "@melt-ui/svelte";
    import { browser } from "$app/environment";
    import { writable, type Writable } from "svelte/store";
    import { AnalysisTab } from "$lib/types";

    export let data: PageData;

    let initialTab = browser
        ? localStorage.getItem("tab") ?? AnalysisTab.StrokesGained
        : AnalysisTab.StrokesGained;
    let activeTab = writable(initialTab);

    const handleChangeTab: CreateTabsProps["onValueChange"] = ({ next }) => {
        if (browser) {
            localStorage.setItem("tab", next);
        }

        return next;
    };

    const {
        elements: { root, list, content, trigger },
    } = createTabs({
        onValueChange: handleChangeTab,
        value: activeTab,
    });

    const roundData = [
        {
            label: "Off the tee",
            tooltip: "The average strokes gained off the tee per round",
            value: data.averageSGOTTForAllRounds || 0,
            border: true,
        },
        {
            label: "Par 4",
            tooltip: "The average strokes gained off the tee per round on par 4 holes only",
            value: data.averageSGOTTForAllRoundsPar4 || 0,
            border: false,
        },
        {
            label: "Par 5",
            tooltip: "The average strokes gained off the tee per round on par 5 holes only",
            value: data.averageSGOTTForAllRoundsPar5 || 0,
            border: false,
        },
    ];

    let barCardTabOptions: [string, string] = ["round", "shot"];
    let activeRoundOrShot = barCardTabOptions[0];

    let selected: Writable<"Tee"> = writable("Tee");
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
            use:melt={$trigger(AnalysisTab.KPIs)}
        >
            Key Performance Metrics
        </div>
    </div>

    <div
        use:melt={$content(AnalysisTab.StrokesGained)}
        class="ring-offset-background focus-visible:ring-primary-600 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
        <div class="grid gap-6 lg:grid-cols-4">
            <BarCard
                title="Round Scoring"
                subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                barData={roundData}
            />

            <div
                class="shadow-component rounded-lg border border-neutral-100 bg-white lg:col-span-3"
            >
                <header class="border-b border-neutral-100 px-6 py-4">
                    <h1 class="text-xl font-medium">Strokes gained: Off the tee</h1>
                    <p class="text-sm text-neutral-600">
                        {data.roundsAmount} Round{data.roundsAmount > 1 ? "s" : ""}
                    </p>
                </header>
                <div class="h-[300px] w-full px-2 py-2 md:px-6 md:py-4 lg:h-[305px]">
                    <LineChart
                        min={Math.ceil(Math.min(...data.offTheTeeChartData) - 1)}
                        max={Math.floor(Math.max(...data.offTheTeeChartData) + 1)}
                        sgData={data.offTheTeeChartData}
                        labels={data.offTheTeeLabels}
                    />
                </div>
            </div>
        </div>

        {#await data.streamed.tableDataOTT then table}
            {@const tableData = [{ ...data.streamed.firstRow }, ...table]}
            <Table tableColumns={data.tableColumns} {tableData} />
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </div>
    <div
        use:melt={$content(AnalysisTab.KPIs)}
        class="ring-offset-background focus-visible:ring-primary-600 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
        <div class="grid gap-6 lg:grid-cols-4">
            <div class="lg:col-span-1">
                <BarCardToggle
                    title="Average Strokes Gained"
                    subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                    tabData={[
                        {
                            id: 1,
                            label: "Tee",
                            value: showRoundOrShotData(
                                activeRoundOrShot,
                                data.averageSGOTTForAllRounds || 0,
                                data.averageSGOTTForAllShots || 0,
                            ),
                            shotsPerRound: data.avgSPRTeeShots || 0,
                        },
                    ]}
                    tabOptions={barCardTabOptions}
                    bind:activeTab={activeRoundOrShot}
                    bind:selected
                />
            </div>
            <div
                class="shadow-component rounded-lg border border-neutral-100 bg-white lg:col-span-3"
            >
                <div class="w-full border-b border-neutral-100 px-6 py-4">
                    <h4 class="flex-1 text-xl font-medium">Key performance metrics</h4>
                    <p class="w-fit text-sm text-neutral-600">
                        {data.roundsAmount} Round{data.roundsAmount > 1 ? "s" : ""}
                    </p>
                </div>

                <div class="flex flex-col gap-8 px-6 pb-6 pt-4">
                    <!-- Keeping this data (barData) staic since we only have one select option -->
                    <KpMetricsBar
                        barData={[
                            {
                                title: "Driving Distance (yds)",
                                max: 350,
                                current: data.avgAdjustedTeeShotDistance || 0,
                                suffix: "yds",
                                goal: "",
                                tooltip: "The average distance of all tee shots",
                            },
                            {
                                title: "Fairway Hit (%)",
                                max: 100,
                                current: data.fairwayAccuracyPercentage || 0,
                                suffix: "%",
                                goal: "",
                                tooltip: "The percentage of tee shots that hit the fairway",
                            },
                            {
                                title: "Poor Tee Shot (%)",
                                max: 100,
                                current: data.poorTeeShotsPercentage || 0,
                                suffix: "%",
                                goal: "",
                                tooltip:
                                    "The percentage of tee shots that lose 0.5 strokes or less",
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    </div>
</div>
