<script lang="ts">
    import LineChart from "../components/LineChart.svelte";
    import BarCard from "../../../../lib/components/BarCard.svelte";
    import Table from "../components/Table.svelte";
    import KpMetricsBar from "../components/KPMetricsBar.svelte";
    import type { PageData } from "./$types";
    import DataTabs from "$lib/components/DataTabs.svelte";
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
            label: "Putting",
            tooltip: "Average strokes gained putting",
            value: data.averageSGPuttingForAllRounds || 0,
            border: true,
        },
        {
            label: "Short Putts",
            tooltip: "All putts less than or equal to 7ft",
            value: data.averageSGPuttingLessThan10 || 0,
            border: false,
        },
        {
            label: "Mid Range Putts",
            tooltip: "All putts between 10ft and 24ft",
            value: data.averageSGPutting10_24 || 0,
            border: false,
        },
        {
            label: "Long Putts",
            tooltip: "All putts greater than or equal to 25ft",
            value: data.averageSGPutting25Plus || 0,
            border: false,
        },
    ];

    // KPI TAB

    let tabOptions = ["short putts", "mid range putts", "long putts"];
    let barCardTabOptions: [string, string] = ["round", "shot"];
    let activePuttType = tabOptions[0];
    let activeRoundOrShot = barCardTabOptions[0];
    let roundSGData = data.averageSGPuttingDistanceBuckets.round;
    let shotSGData = data.averageSGPuttingDistanceBuckets.shot;

    $: kpiTabData = [
        {
            id: 1,
            label: "< 2ft",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["0-2"], shotSGData["0-2"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["0-2"],
        },
        {
            id: 2,
            label: "3-5ft",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["3-5"], shotSGData["3-5"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["3-5"],
        },
        {
            id: 3,
            label: "6-9ft",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["6-9"], shotSGData["6-9"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["6-9"],
        },
        {
            id: 4,
            label: "10-15ft",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["10-15"],
                shotSGData["10-15"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["10-15"],
        },
        {
            id: 5,
            label: "16-25ft",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["16-25"],
                shotSGData["16-25"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["16-25"],
        },
        {
            id: 6,
            label: "26-40ft",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["26-40"],
                shotSGData["26-40"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["26-40"],
        },
        {
            id: 7,
            label: "41-60ft",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["41-60"],
                shotSGData["41-60"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["41-60"],
        },
        {
            id: 8,
            label: "61ft+",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["61+"], shotSGData["61+"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["61+"],
        },
    ];

    let selected: Writable<
        "< 2ft" | "3-5ft" | "6-9ft" | "10-15ft" | "16-25ft" | "26-40ft" | "41-60ft" | "61ft+"
    > = writable("< 2ft");

    let activeKpiTabData = kpiTabData;
    $: if (activePuttType === "short putts") {
        activeKpiTabData = kpiTabData.filter((_, i) => i <= 2);
    } else if (activePuttType === "mid range putts") {
        activeKpiTabData = kpiTabData.filter((_, i) => i >= 3 && i <= 4);
    } else if (activePuttType === "long putts") {
        activeKpiTabData = kpiTabData.filter((_, i) => i >= 5);
    }

    function getBarData(
        selectedTab:
            | "< 2ft"
            | "3-5ft"
            | "6-9ft"
            | "10-15ft"
            | "16-25ft"
            | "26-40ft"
            | "41-60ft"
            | "61ft+",
    ): {
        title: string;
        max: number;
        current: number;
        suffix: string;
        goal: string;
        tooltip: string;
    }[] {
        switch (selectedTab) {
            case "< 2ft":
                return data.barData.zeroToTwoFt;
            case "3-5ft":
                return data.barData.threeToFiveFt;
            case "6-9ft":
                return data.barData.sixToNineFt;
            case "10-15ft":
                return data.barData.tenToFifteenFt;
            case "16-25ft":
                return data.barData.sixteenToTwentyFiveFt;
            case "26-40ft":
                return data.barData.twentySixToFortyFt;
            case "41-60ft":
                return data.barData.fortyOneToSixtyFt;
            case "61ft+":
                return data.barData.sixtyOneFtPlus;
            default:
                return [];
        }
    }
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
                title="Average Strokes Gained"
                subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                barData={roundData}
            />

            <div
                class="shadow-component rounded-lg border border-neutral-100 bg-white lg:col-span-3"
            >
                <div class="border-b border-neutral-100 px-6 py-4">
                    <h4 class="text-xl font-medium">Strokes gained: Putting</h4>
                    <p class="text-sm text-neutral-600">
                        {data.roundsAmount} Round{data.roundsAmount > 1 ? "s" : ""}
                    </p>
                </div>

                <div class="h-[300px] w-full px-2 py-2 md:px-6 md:py-4 lg:h-[305px]">
                    <LineChart
                        min={Math.ceil(Math.min(...data.puttingChartData) - 1)}
                        max={Math.floor(Math.max(...data.puttingChartData) + 1)}
                        sgData={data.puttingChartData}
                        labels={data.puttingLabels}
                    />
                </div>
            </div>
        </div>

        <Table tableColumns={data.tableColumns} tableData={data.tableDataPutting} />
    </div>
    <div
        use:melt={$content(AnalysisTab.KPIs)}
        class="ring-offset-background focus-visible:ring-primary-600 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
        <div class="mb-6 flex">
            <DataTabs {tabOptions} bind:activeTab={activePuttType} />
        </div>

        <div class="grid gap-6 lg:grid-cols-4">
            <div class="lg:col-span-1">
                <BarCardToggle
                    title="Average Strokes Gained"
                    subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                    tabData={activeKpiTabData}
                    tabOptions={barCardTabOptions}
                    bind:activeTab={activeRoundOrShot}
                    bind:selected
                />
            </div>
            <div
                class="shadow-component h-fit rounded-lg border border-neutral-100 bg-white lg:col-span-3"
            >
                <header class="w-full border-b border-neutral-100 px-6 py-4">
                    <h1 class="flex-1 text-xl font-medium">Key performance metrics</h1>
                    <p class="w-fit text-sm text-neutral-600">
                        {data.roundsAmount} Round{data.roundsAmount > 1 ? "s" : ""}
                    </p>
                </header>

                <div class="flex flex-col gap-8 px-6 pb-6 pt-4">
                    <KpMetricsBar barData={getBarData($selected)} />
                </div>
            </div>
        </div>
    </div>
</div>
