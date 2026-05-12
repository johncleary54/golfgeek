<script lang="ts">
    import LineChart from "../components/LineChart.svelte";
    import BarCard from "$lib/components/BarCard.svelte";
    import Table from "../components/Table.svelte";
    import KpMetricsBar from "../components/KPMetricsBar.svelte";
    import type { PageData } from "./$types";
    import BarCardToggle from "$lib/components/BarCardToggle.svelte";
    import DataTabs from "$lib/components/DataTabs.svelte";
    import { AnalysisTab, ApproachDistanceBucket, ApproachType } from "$lib/types";
    import { showRoundOrShotData } from "$lib/utils";
    import { createTabs, melt, type CreateTabsProps } from "@melt-ui/svelte";
    import { browser } from "$app/environment";
    import { writable, type Writable } from "svelte/store";

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
            label: "Approach",
            tooltip: "The average strokes gained approach per round",
            value: data.averageSGApproachForAllRounds || 0,
            border: true,
        },
        {
            label: ApproachDistanceBucket.Approach_101_150,
            tooltip: "101-150 yards",
            value: data.averageSGApproachDistanceBuckets.round[
                ApproachDistanceBucket.Approach_101_150
            ],
            border: false,
        },
        {
            label: ApproachDistanceBucket.Approach_151_200,
            tooltip: "151-200 yards",
            value: data.averageSGApproachDistanceBuckets.round[
                ApproachDistanceBucket.Approach_151_200
            ],
            border: false,
        },
        {
            label: ApproachDistanceBucket.Approach_201_250,
            tooltip: "201-250 yards",
            value: data.averageSGApproachDistanceBuckets.round[
                ApproachDistanceBucket.Approach_201_250
            ],
            border: false,
        },
        {
            label: ApproachDistanceBucket.Approach_251Plus,
            tooltip: "251+ yards",
            value: data.averageSGApproachDistanceBuckets.round[
                ApproachDistanceBucket.Approach_251Plus
            ],
            border: false,
        },
    ];

    let activeApproachType = ApproachDistanceBucket.Approach_101_150;

    let activeRoundOrShot = ApproachType.Round;

    let selected: Writable<"Fairway" | "Rough"> = writable("Fairway");

    let kpiTabData: {
        id: number;
        label: string;
        value: number;
        shotsPerRound: number;
    }[] = [];

    $: kpiTabData = [
        {
            id: 1,
            label: "Fairway",
            value: showRoundOrShotData(
                activeRoundOrShot,
                data.averageSGApproachFairwayDistanceBuckets.round[activeApproachType],
                data.averageSGApproachFairwayDistanceBuckets.shot[activeApproachType],
            ),
            shotsPerRound: data.avgSPRApproachFairway[activeApproachType] ?? 0,
        },
        {
            id: 2,
            label: "Rough",
            value: showRoundOrShotData(
                activeRoundOrShot,
                data.averageSGApproachRoughDistanceBuckets.round[activeApproachType],
                data.averageSGApproachRoughDistanceBuckets.shot[activeApproachType],
            ),
            shotsPerRound: data.avgSPRApproachRough[activeApproachType] ?? 0,
        },
    ];

    function getBarData(
        selectedApproachType: ApproachDistanceBucket,
        selectedLocation: "Fairway" | "Rough" | null,
    ): {
        title: string;
        max: number;
        current: number;
        suffix: string;
        goal: string;
        tooltip: string;
    }[] {
        const selectedData =
            selectedLocation === "Fairway"
                ? data.kpMetricsData.fairway
                : selectedLocation === "Rough"
                ? data.kpMetricsData.rough
                : null;

        if (!selectedData) {
            return [];
        }

        switch (selectedApproachType) {
            case "101-150":
                return selectedData["101-150"];
            case "151-200":
                return selectedData["151-200"];
            case "201-250":
                return selectedData["201-250"];
            case "251+":
                return selectedData["251+"];
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
                <header class="border-b border-neutral-100 px-6 py-4">
                    <h1 class="text-xl font-medium">Strokes gained: Approach</h1>
                    <p class="text-sm text-neutral-600">
                        {data.roundsAmount} Round{data.roundsAmount > 1 ? "s" : ""}
                    </p>
                </header>
                <div class="h-[300px] w-full px-2 py-2 md:px-6 md:py-4 lg:h-[305px]">
                    <LineChart
                        min={Math.ceil(Math.min(...data.approachChartData) - 1)}
                        max={Math.floor(Math.max(...data.approachChartData) + 1)}
                        sgData={data.approachChartData}
                        labels={data.approachLabels}
                    />
                </div>
            </div>
        </div>

        <Table tableColumns={data.tableColumns} tableData={data.tableDataApproach} />
    </div>
    <div
        use:melt={$content(AnalysisTab.KPIs)}
        class="ring-offset-background focus-visible:ring-primary-600 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
        <div class="mb-6 flex">
            <DataTabs
                tabOptions={Object.values(ApproachDistanceBucket)}
                bind:activeTab={activeApproachType}
            />
        </div>

        <div class="grid gap-6 lg:grid-cols-4">
            <div class="lg:col-span-1">
                <BarCardToggle
                    title="Average Strokes Gained"
                    subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
                    tabData={kpiTabData}
                    tabOptions={Object.values(ApproachType)}
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
                    <KpMetricsBar barData={getBarData(activeApproachType, $selected)} />
                </div>
            </div>
        </div>
    </div>
</div>
