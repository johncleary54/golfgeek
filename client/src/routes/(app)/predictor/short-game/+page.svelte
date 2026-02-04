<script lang="ts">
    import DataTabs from "$lib/components/DataTabs.svelte";
    import BarCardToggle from "$lib/components/BarCardToggle.svelte";
    import SgpBar from "../components/SGPBar.svelte";
    import SliderWithInput from "../components/SliderWithInput.svelte";
    import { PredictorType } from "../predictor.type";
    import { writable } from "svelte/store";
    import type { ActionData, PageData } from "./$types";
    import { feetToYards, showRoundOrShotData } from "$lib/utils";
    import { ShortGameDistanceBucket, type SliderData } from "$lib/types";
    import type { Writable } from "svelte/store";
    import BenchmarkModal from "../components/BenchmarkModal.svelte";
    import BenchmarkPersonal from "../components/BenchmarkPersonal.svelte";
    import { toast } from "$lib/components/toast/toast";
    import {
        SHORT_GAME_FIXED_VALUE,
        SHORT_GAME_GREEN_HIT_PERCENTAGE_COEFFICIENT,
        SHORT_GAME_GREEN_HIT_PERCENTAGE_STDDEV,
        SHORT_GAME_HOLE_OUT_COEFFICIENT,
        SHORT_GAME_HOLE_OUT_STDDEV,
        SHORT_GAME_PROXIMITY_COEFFICIENT,
        SHORT_GAME_PROXIMITY_STDDEV,
        TOUR_AVERAGES_SHORT_GAME_HOLE_OUT,
        TOUR_AVERAGES_SHORT_GAME_PROXIMITY,
        TOUR_AVERAGE_SHORT_GAME_GREEN_HIT_PERCENTAGE,
    } from "../../../../constants/predictorShortGame";

    export let data: PageData;
    export let form: ActionData;
    $: if (form?.error) {
        toast({
            message: form.error,
            type: "error",
        });
    }

    // LOGIC
    function calcStandardisedVariable(value: number, mean: number, stdDev: number): number {
        return (value - mean) / stdDev;
    }

    function calcNewValue(value: number, tourAvg: number): number {
        return value - tourAvg;
    }

    function calcModelEquationFairwayLessThan25({
        stdVarHoleOut,
        stdVarProximity,
        fixed,
        coefficientHoleOut,
        coefficientProximity,
    }: {
        stdVarHoleOut: number;
        stdVarProximity: number;
        fixed: number;
        coefficientHoleOut: number;
        coefficientProximity: number;
    }): number {
        return +(
            fixed +
            coefficientHoleOut * stdVarHoleOut +
            coefficientProximity * stdVarProximity
        ).toFixed(3);
    }

    function calcModelEquation({
        stdVarGreenHit,
        stdVarProximity,
        fixed,
        coefficientGreenHit,
        coefficientProximity,
    }: {
        stdVarGreenHit: number;
        stdVarProximity: number;
        fixed: number;
        coefficientGreenHit: number;
        coefficientProximity: number;
    }): number {
        return +(
            fixed +
            coefficientGreenHit * stdVarGreenHit +
            coefficientProximity * stdVarProximity
        ).toFixed(3);
    }
    //

    let modifiedStrokesGainedPredictorValue: {
        fairway: {
            [key in ShortGameDistanceBucket]: number;
        };
        rough: {
            [key in ShortGameDistanceBucket]: number;
        };
        sand: {
            [key in ShortGameDistanceBucket]: number;
        };
    } = data.SGPData;

    let activeShortGameType = ShortGameDistanceBucket.ShortGame_0_25;
    let barCardTabOptions: [string, string] = ["round", "shot"];
    let activeRoundOrShot = barCardTabOptions[0];
    let selected: Writable<"fairway" | "rough" | "sand"> = writable("fairway");

    let kpiTabData: {
        id: number;
        label: string;
        value: number;
        shotsPerRound: number;
    }[] = [];

    $: kpiTabData = [
        {
            id: 1,
            label: "fairway",
            value: showRoundOrShotData(
                activeRoundOrShot,
                data.averageSGFairwayShortGameDistanceBuckets.round[activeShortGameType],
                data.averageSGFairwayShortGameDistanceBuckets.shot[activeShortGameType],
            ),
            shotsPerRound: data.avgSPRShortGameFairway[activeShortGameType] ?? 0,
        },
        {
            id: 2,
            label: "rough",
            value: showRoundOrShotData(
                activeRoundOrShot,
                data.averageSGRoughShortGameDistanceBuckets.round[activeShortGameType],
                data.averageSGRoughShortGameDistanceBuckets.shot[activeShortGameType],
            ),
            shotsPerRound: data.avgSPRShortGameRough[activeShortGameType] ?? 0,
        },
        {
            id: 3,
            label: "sand",
            value: showRoundOrShotData(
                activeRoundOrShot,
                data.averageSGSandShortGameDistanceBuckets.round[activeShortGameType],
                data.averageSGSandShortGameDistanceBuckets.shot[activeShortGameType],
            ),
            shotsPerRound: data.avgSPRShortGameSand[activeShortGameType] ?? 0,
        },
    ];

    $: {
        if (activeShortGameType !== ShortGameDistanceBucket.ShortGame_0_25) {
            kpiTabData = kpiTabData.filter((item) => item.label !== "sand");
            selected.update((value) => (value === "sand" ? "fairway" : value));
        }
    }

    const barData: {
        fairway: {
            [key in ShortGameDistanceBucket]: SliderData[];
        };
        rough: {
            [key in ShortGameDistanceBucket]: SliderData[];
        };
        sand: {
            [key in ShortGameDistanceBucket]: SliderData[];
        };
    } = {
        fairway: {
            [ShortGameDistanceBucket.ShortGame_0_25]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.fairway["0-25"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Fairway_0_25_Proximity,
                    unit: "ft",
                    maxRange: 50,
                },
                {
                    title: "Hole Out %",
                    tooltip: "Hole Out %",
                    sliderValue: writable([data.adjustedHoleOutPercentages["0-25"]]),
                    type: PredictorType.ShortGame_Fairway_0_25_Hole_Out,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ShortGameDistanceBucket.ShortGame_26_50]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.fairway["26-50"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Fairway_26_50_Proximity,
                    unit: "ft",
                    maxRange: 75,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.fairway["26-50"]]),
                    type: PredictorType.ShortGame_Fairway_26_50_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ShortGameDistanceBucket.ShortGame_51_75]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.fairway["51-75"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Fairway_51_75_Proximity,
                    unit: "ft",
                    maxRange: 100,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.fairway["51-75"]]),
                    type: PredictorType.ShortGame_Fairway_51_75_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ShortGameDistanceBucket.ShortGame_76_100]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.fairway["76-100"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Fairway_76_100_Proximity,
                    unit: "ft",
                    maxRange: 150,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.fairway["76-100"]]),
                    type: PredictorType.ShortGame_Fairway_76_100_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
        },
        rough: {
            [ShortGameDistanceBucket.ShortGame_0_25]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.rough["0-25"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Rough_0_25_Proximity,
                    unit: "ft",
                    maxRange: 50,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.rough["0-25"]]),
                    type: PredictorType.ShortGame_Rough_0_25_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ShortGameDistanceBucket.ShortGame_26_50]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.rough["26-50"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Rough_26_50_Proximity,
                    unit: "yds",
                    maxRange: 75,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.rough["26-50"]]),
                    type: PredictorType.ShortGame_Rough_26_50_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ShortGameDistanceBucket.ShortGame_51_75]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.rough["51-75"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Rough_51_75_Proximity,
                    unit: "ft",
                    maxRange: 100,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.rough["51-75"]]),
                    type: PredictorType.ShortGame_Rough_51_75_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ShortGameDistanceBucket.ShortGame_76_100]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.rough["76-100"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Rough_76_100_Proximity,
                    unit: "ft",
                    maxRange: 150,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.rough["76-100"]]),
                    type: PredictorType.ShortGame_Rough_76_100_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
        },
        sand: {
            [ShortGameDistanceBucket.ShortGame_0_25]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.avgShortGameProximities.sand["0-25"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.ShortGame_Sand_0_25_Proximity,
                    unit: "ft",
                    maxRange: 50,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.avgShortGameGreenHitPercentages.sand["0-25"]]),
                    type: PredictorType.ShortGame_Sand_0_25_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ShortGameDistanceBucket.ShortGame_26_50]: [],
            [ShortGameDistanceBucket.ShortGame_51_75]: [],
            [ShortGameDistanceBucket.ShortGame_76_100]: [],
        },
    };

    function getBarData(
        selectedType: ShortGameDistanceBucket,
        selectedLocation: "fairway" | "rough" | "sand" | null,
    ): SliderData[] {
        const selectedData =
            selectedLocation === "fairway"
                ? barData.fairway
                : selectedLocation === "rough"
                ? barData.rough
                : selectedLocation === "sand"
                ? barData.sand
                : null;

        if (!selectedData) {
            return [];
        }

        switch (selectedType) {
            case "0-25":
                return selectedData[ShortGameDistanceBucket.ShortGame_0_25];
            case "26-50":
                return selectedData[ShortGameDistanceBucket.ShortGame_26_50];
            case "51-75":
                return selectedData[ShortGameDistanceBucket.ShortGame_51_75];
            case "76-100":
                return selectedData[ShortGameDistanceBucket.ShortGame_76_100];
            default:
                return [];
        }
    }

    let value1: Writable<number[]> | undefined = barData.fairway["0-25"][0]?.sliderValue;
    let type1: PredictorType | undefined = PredictorType.ShortGame_Fairway_0_25_Proximity;
    let value2: Writable<number[]> | undefined = undefined;
    let type2: PredictorType | undefined = undefined;

    // TODO - refactor this monstrosity
    $: if (activeShortGameType === ShortGameDistanceBucket.ShortGame_0_25) {
        if ($selected === "fairway") {
            value1 = barData.fairway["0-25"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Fairway_0_25_Proximity;
            value2 = barData.fairway["0-25"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Fairway_0_25_Hole_Out;
        } else if ($selected === "rough") {
            value1 = barData.rough["0-25"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Rough_0_25_Proximity;
            value2 = barData.rough["0-25"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Rough_0_25_Green_Hit;
        } else {
            value1 = barData.sand["0-25"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Sand_0_25_Proximity;
            value2 = barData.sand["0-25"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Sand_0_25_Green_Hit;
        }
    } else if (activeShortGameType === ShortGameDistanceBucket.ShortGame_26_50) {
        if ($selected === "fairway") {
            value1 = barData.fairway["26-50"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Fairway_26_50_Proximity;
            value2 = barData.fairway["26-50"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Fairway_26_50_Green_Hit;
        } else if ($selected === "rough") {
            value1 = barData.rough["26-50"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Rough_26_50_Proximity;
            value2 = barData.rough["26-50"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Rough_26_50_Green_Hit;
        }
    } else if (activeShortGameType === ShortGameDistanceBucket.ShortGame_51_75) {
        if ($selected === "fairway") {
            value1 = barData.fairway["51-75"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Fairway_51_75_Proximity;
            value2 = barData.fairway["51-75"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Fairway_51_75_Green_Hit;
        } else if ($selected === "rough") {
            value1 = barData.rough["51-75"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Rough_51_75_Proximity;
            value2 = barData.rough["51-75"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Rough_51_75_Green_Hit;
        }
    } else {
        if ($selected === "fairway") {
            value1 = barData.fairway["76-100"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Fairway_76_100_Proximity;
            value2 = barData.fairway["76-100"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Fairway_76_100_Green_Hit;
        } else if ($selected === "rough") {
            value1 = barData.rough["76-100"][0]?.sliderValue;
            type1 = PredictorType.ShortGame_Rough_76_100_Proximity;
            value2 = barData.rough["76-100"][1]?.sliderValue;
            type2 = PredictorType.ShortGame_Rough_76_100_Green_Hit;
        }
    }

    $: val1Var = $value1?.[0] ?? 0;
    $: val2Var = $value2?.[0] ?? 0;

    $: {
        /**
         * Mean is Zero for all
         *
         * value1 = proximity
         * value2 = green hit
         * value2 on fairway 0-25 is hole out
         */
        if (val1Var <= 0 && val2Var <= 0) {
            modifiedStrokesGainedPredictorValue[$selected][activeShortGameType] = 0;
        } else {
            let xVal1;
            let xVal2;
            let zVal1;
            let zVal2;

            xVal1 = calcNewValue(
                feetToYards(val1Var),
                TOUR_AVERAGES_SHORT_GAME_PROXIMITY[$selected][activeShortGameType],
            );

            zVal1 = calcStandardisedVariable(
                xVal1,
                0,
                SHORT_GAME_PROXIMITY_STDDEV[$selected][activeShortGameType],
            );

            if (
                activeShortGameType === ShortGameDistanceBucket.ShortGame_0_25 &&
                $selected === "fairway"
            ) {
                xVal2 = calcNewValue(
                    val2Var / 100,
                    TOUR_AVERAGES_SHORT_GAME_HOLE_OUT[$selected][activeShortGameType],
                );

                zVal2 = calcStandardisedVariable(
                    xVal2,
                    0,
                    SHORT_GAME_HOLE_OUT_STDDEV[$selected][activeShortGameType],
                );
            } else {
                xVal2 = calcNewValue(
                    val2Var / 100,
                    TOUR_AVERAGE_SHORT_GAME_GREEN_HIT_PERCENTAGE[$selected][activeShortGameType],
                );

                zVal2 = calcStandardisedVariable(
                    xVal2,
                    0,
                    SHORT_GAME_GREEN_HIT_PERCENTAGE_STDDEV[$selected][activeShortGameType],
                );
            }

            if (
                activeShortGameType === ShortGameDistanceBucket.ShortGame_0_25 &&
                $selected === "fairway"
            ) {
                modifiedStrokesGainedPredictorValue[$selected][activeShortGameType] =
                    calcModelEquationFairwayLessThan25({
                        stdVarHoleOut: zVal2,
                        stdVarProximity: zVal1,
                        fixed: SHORT_GAME_FIXED_VALUE[$selected][activeShortGameType],
                        coefficientHoleOut:
                            SHORT_GAME_HOLE_OUT_COEFFICIENT[$selected][activeShortGameType],
                        coefficientProximity:
                            SHORT_GAME_PROXIMITY_COEFFICIENT[$selected][activeShortGameType],
                    });
            } else {
                modifiedStrokesGainedPredictorValue[$selected][activeShortGameType] =
                    calcModelEquation({
                        stdVarGreenHit: zVal2,
                        stdVarProximity: zVal1,
                        fixed: SHORT_GAME_FIXED_VALUE[$selected][activeShortGameType],
                        coefficientGreenHit:
                            SHORT_GAME_GREEN_HIT_PERCENTAGE_COEFFICIENT[$selected][
                                activeShortGameType
                            ],
                        coefficientProximity:
                            SHORT_GAME_PROXIMITY_COEFFICIENT[$selected][activeShortGameType],
                    });
            }
        }
    }
</script>

<div class="mb-6 flex">
    <DataTabs
        tabOptions={Object.values(ShortGameDistanceBucket)}
        bind:activeTab={activeShortGameType}
    />
</div>

<div class="grid gap-6 lg:grid-cols-4">
    <BarCardToggle
        title="Average Strokes Gained"
        subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
        tabData={kpiTabData}
        tabOptions={barCardTabOptions}
        bind:activeTab={activeRoundOrShot}
        bind:selected
    />

    <div class="shadow-card rounded-lg border border-neutral-100 lg:col-span-3">
        <div class="items-center justify-between border-b border-neutral-100 px-6 py-4 sm:flex">
            <h4 class="text-xl font-medium">Short game</h4>

            <div class="mt-2 flex gap-2 sm:mt-0">
                {#key `${activeRoundOrShot}-${$selected}`}
                    <BenchmarkModal
                        value1={$value1}
                        {type1}
                        value2={$value2}
                        {type2}
                        value3={undefined}
                        type3={undefined}
                        value4={undefined}
                        type4={undefined}
                        predictors={data.predictors}
                        benchmarks={data.benchmarks}
                        golfers={data.golfers}
                    />
                {/key}
                {#key `${activeRoundOrShot}-${$selected}`}
                    <BenchmarkPersonal
                        value1={$value1}
                        {type1}
                        value2={$value2}
                        {type2}
                        value3={undefined}
                        type3={undefined}
                        value4={undefined}
                        type4={undefined}
                        predictors={data.predictors}
                        benchmarks={data.benchmarks}
                    />
                {/key}
            </div>
        </div>

        <div class="px-6 pb-6 pt-4">
            <SgpBar
                strokesGained={modifiedStrokesGainedPredictorValue[$selected][activeShortGameType]}
            />

            <hr class="my-6 border-neutral-100" />

            <div class="flex flex-col gap-2">
                {#each getBarData(activeShortGameType, $selected) as item}
                    {@const benchmark = data.predictors.find((p) => p.type === item.type)}
                    {#key item.type}
                        <SliderWithInput
                            benchmark={benchmark?.value}
                            title={item.title}
                            tooltip={item.tooltip}
                            sliderValue={item.sliderValue}
                            unit={item.unit}
                            maxRange={item.maxRange}
                        />
                    {/key}
                {/each}
            </div>
        </div>
    </div>
</div>
