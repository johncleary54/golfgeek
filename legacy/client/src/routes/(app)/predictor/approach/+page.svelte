<script lang="ts">
    import DataTabs from "$lib/components/DataTabs.svelte";
    import BarCardToggle from "$lib/components/BarCardToggle.svelte";
    import SGPBar from "../components/SGPBar.svelte";
    import SliderWithInput from "../components/SliderWithInput.svelte";
    import BenchmarkModal from "../components/BenchmarkModal.svelte";
    import type { ActionData, PageData } from "./$types";
    import { ApproachDistanceBucket, ApproachType, type SliderData } from "$lib/types";
    import { feetToYards, showRoundOrShotData } from "$lib/utils";
    import { PredictorType } from "../predictor.type";
    import { toast } from "$lib/components/toast/toast";
    import { writable, type Writable } from "svelte/store";
    import BenchmarkPersonal from "../components/BenchmarkPersonal.svelte";
    import {
        APPROACH_FIXED_VALUE,
        APPROACH_GREEN_HIT_PERCENTAGE_COEFFICIENT,
        APPROACH_GREEN_HIT_PERCENTAGE_STDDEV,
        APPROACH_POOR_SHOT_PERCENTAGE_COEFFICIENT,
        APPROACH_POOR_SHOT_PERCENTAGE_MEAN,
        APPROACH_POOR_SHOT_PERCENTAGE_STDDEV,
        APPROACH_PROXIMITY_COEFFICIENT,
        APPROACH_PROXIMITY_STDDEV,
        TOUR_AVERAGES_APPROACH_PROXIMITY,
        TOUR_AVERAGE_APPROACH_GREEN_HIT_PERCENTAGE,
    } from "../../../../constants/predictorApproach";

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

    function calcModelEquationTwo({
        stdVarGreenHit,
        stdVarProximity,
        stdVarPoorShot,
        fixed,
        coefficientGreenHit,
        coefficientProximity,
        coefficientPoorShot,
    }: {
        stdVarGreenHit: number;
        stdVarProximity: number;
        stdVarPoorShot: number;
        fixed: number;
        coefficientGreenHit: number;
        coefficientProximity: number;
        coefficientPoorShot: number;
    }): number {
        return +(
            fixed +
            coefficientGreenHit * stdVarGreenHit +
            coefficientProximity * stdVarProximity +
            coefficientPoorShot * stdVarPoorShot
        ).toFixed(3);
    }
    //

    let modifiedStrokesGainedPredictorValue: {
        fairway: {
            [key in ApproachDistanceBucket]: number;
        };
        rough: {
            [key in ApproachDistanceBucket]: number;
        };
    } = data.SGPData;

    const barData: {
        fairway: {
            [key in ApproachDistanceBucket]: SliderData[];
        };
        rough: {
            [key in ApproachDistanceBucket]: SliderData[];
        };
    } = {
        fairway: {
            [ApproachDistanceBucket.Approach_101_150]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.fairway["101-150"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Fairway_101_150_Proximity,
                    unit: "ft",
                    maxRange: 50,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([
                        data.averageAdjustedGreenHitPercentages.fairway["101-150"],
                    ]),
                    type: PredictorType.Approach_Fairway_101_150_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ApproachDistanceBucket.Approach_151_200]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.fairway["151-200"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Fairway_151_200_Proximity,
                    unit: "ft",
                    maxRange: 125,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([
                        data.averageAdjustedGreenHitPercentages.fairway["151-200"],
                    ]),
                    type: PredictorType.Approach_Fairway_151_200_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
                {
                    title: "Poor Shot (%)",
                    tooltip: "Poor Shot (%)",
                    sliderValue: writable([data.poorAppShotPercentages.fairway["151-200"]]),
                    type: PredictorType.Approach_Fairway_151_200_Poor_Shot,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ApproachDistanceBucket.Approach_201_250]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.fairway["201-250"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Fairway_201_250_Proximity,
                    unit: "ft",
                    maxRange: 150,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([
                        +data.averageAdjustedGreenHitPercentages.fairway["201-250"].toFixed(2),
                    ]),
                    type: PredictorType.Approach_Fairway_201_250_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
                {
                    title: "Poor Shot (%)",
                    tooltip: "Poor Shot (%)",
                    sliderValue: writable([data.poorAppShotPercentages.fairway["201-250"]]),
                    type: PredictorType.Approach_Fairway_201_250_Poor_Shot,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ApproachDistanceBucket.Approach_251Plus]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.fairway["251+"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Fairway_251_Plus_Proximity,
                    unit: "ft",
                    maxRange: 200,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([
                        data.averageAdjustedGreenHitPercentages.fairway["251+"],
                    ]),
                    type: PredictorType.Approach_Fairway_251_Plus_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
                {
                    title: "Poor Shot (%)",
                    tooltip: "Poor Shot (%)",
                    sliderValue: writable([data.poorAppShotPercentages.fairway["251+"]]),
                    type: PredictorType.Approach_Fairway_251_Plus_Poor_Shot,
                    unit: "%",
                    maxRange: 100,
                },
            ],
        },
        rough: {
            [ApproachDistanceBucket.Approach_101_150]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.rough["101-150"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Rough_101_150_Proximity,
                    unit: "ft",
                    maxRange: 50,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([
                        data.averageAdjustedGreenHitPercentages.rough["101-150"],
                    ]),
                    type: PredictorType.Approach_Rough_101_150_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ApproachDistanceBucket.Approach_151_200]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.rough["151-200"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Rough_151_200_Proximity,
                    unit: "ft",
                    maxRange: 125,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([
                        data.averageAdjustedGreenHitPercentages.rough["151-200"],
                    ]),
                    type: PredictorType.Approach_Rough_151_200_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
                {
                    title: "Poor Shot (%)",
                    tooltip: "Poor Shot (%)",
                    sliderValue: writable([data.poorAppShotPercentages.rough["151-200"]]),
                    type: PredictorType.Approach_Rough_151_200_Poor_Shot,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ApproachDistanceBucket.Approach_201_250]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.rough["201-250"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Rough_201_250_Proximity,
                    unit: "ft",
                    maxRange: 150,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([
                        data.averageAdjustedGreenHitPercentages.rough["201-250"],
                    ]),
                    type: PredictorType.Approach_Rough_201_250_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
                {
                    title: "Poor Shot (%)",
                    tooltip: "Poor Shot (%)",
                    sliderValue: writable([data.poorAppShotPercentages.rough["201-250"]]),
                    type: PredictorType.Approach_Rough_201_250_Poor_Shot,
                    unit: "%",
                    maxRange: 100,
                },
            ],
            [ApproachDistanceBucket.Approach_251Plus]: [
                {
                    title: "Average Proximity (ft)",
                    tooltip: "Average Proximity (ft)",
                    sliderValue: writable([
                        +(data.averageAdjustedApproachProximity.rough["251+"] * 3).toFixed(2),
                    ]),
                    type: PredictorType.Approach_Rough_251_Plus_Proximity,
                    unit: "ft",
                    maxRange: 200,
                },
                {
                    title: "Green Hit %",
                    tooltip: "Green Hit %",
                    sliderValue: writable([data.averageAdjustedGreenHitPercentages.rough["251+"]]),
                    type: PredictorType.Approach_Rough_251_Plus_Green_Hit,
                    unit: "%",
                    maxRange: 100,
                },
                {
                    title: "Poor Shot (%)",
                    tooltip: "Poor Shot (%)",
                    sliderValue: writable([data.poorAppShotPercentages.rough["251+"]]),
                    type: PredictorType.Approach_Rough_251_Plus_Poor_Shot,
                    unit: "%",
                    maxRange: 100,
                },
            ],
        },
    };

    let activeApproachType = ApproachDistanceBucket.Approach_101_150;
    let barCardTabOptions: [string, string] = ["round", "shot"];
    let activeRoundOrShot = barCardTabOptions[0];
    let selected: Writable<"fairway" | "rough"> = writable("fairway");

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
                data.averageSGApproachFairwayDistanceBuckets.round[activeApproachType],
                data.averageSGApproachFairwayDistanceBuckets.shot[activeApproachType],
            ),
            shotsPerRound: data.avgSPRApproachFairway[activeApproachType] ?? 0,
        },
        {
            id: 2,
            label: "rough",
            value: showRoundOrShotData(
                activeRoundOrShot,
                data.averageSGApproachRoughDistanceBuckets.round[activeApproachType],
                data.averageSGApproachRoughDistanceBuckets.shot[activeApproachType],
            ),
            shotsPerRound: data.avgSPRApproachRough[activeApproachType] ?? 0,
        },
    ];

    function getBarData(
        selectedApproachType: string,
        selectedLocation: "fairway" | "rough" = "fairway",
    ): SliderData[] {
        const selectedData = selectedLocation === "fairway" ? barData.fairway : barData.rough;

        switch (selectedApproachType) {
            case "101-150":
                return selectedData[ApproachDistanceBucket.Approach_101_150];
            case "151-200":
                return selectedData[ApproachDistanceBucket.Approach_151_200];
            case "201-250":
                return selectedData[ApproachDistanceBucket.Approach_201_250];
            case "251+":
                return selectedData[ApproachDistanceBucket.Approach_251Plus];
            default:
                return [];
        }
    }

    let value1: Writable<number[]> | undefined = barData.fairway["101-150"][0]?.sliderValue;
    let type1: PredictorType | undefined = PredictorType.Approach_Fairway_101_150_Proximity;
    let value2: Writable<number[]> | undefined = undefined;
    let type2: PredictorType | undefined = undefined;
    let value3: Writable<number[]> | undefined = undefined;
    let type3: PredictorType | undefined = undefined;

    // TODO - refactor this monstrosity
    $: if (activeApproachType === ApproachDistanceBucket.Approach_101_150) {
        if ($selected === "fairway") {
            value1 = barData.fairway["101-150"][0]?.sliderValue;
            type1 = PredictorType.Approach_Fairway_101_150_Proximity;
            value2 = barData.fairway["101-150"][1]?.sliderValue;
            type2 = PredictorType.Approach_Fairway_101_150_Green_Hit;
            value3 = undefined;
            type3 = undefined;
        } else {
            value1 = barData.rough["101-150"][0]?.sliderValue;
            type1 = PredictorType.Approach_Rough_101_150_Proximity;
            value2 = barData.rough["101-150"][1]?.sliderValue;
            type2 = PredictorType.Approach_Rough_101_150_Green_Hit;
            value3 = undefined;
            type3 = undefined;
        }
    } else if (activeApproachType === ApproachDistanceBucket.Approach_151_200) {
        if ($selected === "fairway") {
            value1 = barData.fairway["151-200"][0]?.sliderValue;
            type1 = PredictorType.Approach_Rough_151_200_Proximity;
            value2 = barData.fairway["151-200"][1]?.sliderValue;
            type2 = PredictorType.Approach_Rough_151_200_Green_Hit;
            value3 = barData.fairway["151-200"][2]?.sliderValue;
            type3 = PredictorType.Approach_Rough_151_200_Poor_Shot;
        } else {
            value1 = barData.rough["151-200"][0]?.sliderValue;
            type1 = PredictorType.Approach_Rough_151_200_Proximity;
            value2 = barData.rough["151-200"][1]?.sliderValue;
            type2 = PredictorType.Approach_Rough_151_200_Green_Hit;
            value3 = barData.rough["151-200"][2]?.sliderValue;
            type3 = PredictorType.Approach_Rough_151_200_Poor_Shot;
        }
    } else if (activeApproachType === ApproachDistanceBucket.Approach_201_250) {
        if ($selected === "fairway") {
            value1 = barData.fairway["201-250"][0]?.sliderValue;
            type1 = PredictorType.Approach_Fairway_201_250_Proximity;
            value2 = barData.fairway["201-250"][1]?.sliderValue;
            type2 = PredictorType.Approach_Fairway_201_250_Green_Hit;
            value3 = barData.fairway["201-250"][2]?.sliderValue;
            type3 = PredictorType.Approach_Fairway_201_250_Poor_Shot;
        } else {
            value1 = barData.rough["201-250"][0]?.sliderValue;
            type1 = PredictorType.Approach_Rough_201_250_Proximity;
            value2 = barData.rough["201-250"][1]?.sliderValue;
            type2 = PredictorType.Approach_Rough_201_250_Green_Hit;
            value3 = barData.rough["201-250"][2]?.sliderValue;
            type3 = PredictorType.Approach_Rough_201_250_Poor_Shot;
        }
    } else {
        if ($selected === "fairway") {
            value1 = barData.fairway["251+"][0]?.sliderValue;
            type1 = PredictorType.Approach_Fairway_251_Plus_Proximity;
            value2 = barData.fairway["251+"][1]?.sliderValue;
            type2 = PredictorType.Approach_Fairway_251_Plus_Green_Hit;
            value3 = barData.fairway["251+"][2]?.sliderValue;
            type3 = PredictorType.Approach_Fairway_251_Plus_Poor_Shot;
        } else {
            value1 = barData.rough["251+"][0]?.sliderValue;
            type1 = PredictorType.Approach_Rough_251_Plus_Proximity;
            value2 = barData.rough["251+"][1]?.sliderValue;
            type2 = PredictorType.Approach_Rough_251_Plus_Green_Hit;
            value3 = barData.rough["251+"][2]?.sliderValue;
            type3 = PredictorType.Approach_Rough_251_Plus_Poor_Shot;
        }
    }

    $: val1Var = $value1?.[0] ?? 0;
    $: val2Var = $value2?.[0] ?? 0;
    $: val3Var = $value3?.[0] ?? 0;

    $: {
        /**
         * Mean is Zero for Proximity (xVal1) and Green Hit (xVal2)
         */
        if (val1Var <= 0 && val2Var <= 0 && val3Var <= 0) {
            modifiedStrokesGainedPredictorValue[$selected][activeApproachType] = 0;
        } else {
            const xVal1 = calcNewValue(
                feetToYards(val1Var),
                TOUR_AVERAGES_APPROACH_PROXIMITY[$selected][activeApproachType],
            );

            const xVal2 = calcNewValue(
                val2Var / 100,
                TOUR_AVERAGE_APPROACH_GREEN_HIT_PERCENTAGE[$selected][activeApproachType],
            );

            const xVal3 = val3Var / 100;

            const zVal1 = calcStandardisedVariable(
                xVal1,
                0,
                APPROACH_PROXIMITY_STDDEV[$selected][activeApproachType],
            );

            const zVal2 = calcStandardisedVariable(
                xVal2,
                0,
                APPROACH_GREEN_HIT_PERCENTAGE_STDDEV[$selected][activeApproachType],
            );

            const zVal3 = calcStandardisedVariable(
                xVal3,
                APPROACH_POOR_SHOT_PERCENTAGE_MEAN[$selected][activeApproachType],
                APPROACH_POOR_SHOT_PERCENTAGE_STDDEV[$selected][activeApproachType],
            );

            if (activeApproachType === ApproachDistanceBucket.Approach_101_150) {
                modifiedStrokesGainedPredictorValue[$selected][activeApproachType] =
                    calcModelEquation({
                        stdVarGreenHit: zVal2,
                        stdVarProximity: zVal1,
                        fixed: APPROACH_FIXED_VALUE[$selected][activeApproachType],
                        coefficientGreenHit:
                            APPROACH_GREEN_HIT_PERCENTAGE_COEFFICIENT[$selected][
                                activeApproachType
                            ],
                        coefficientProximity:
                            APPROACH_PROXIMITY_COEFFICIENT[$selected][activeApproachType],
                    });
            } else {
                modifiedStrokesGainedPredictorValue[$selected][activeApproachType] =
                    calcModelEquationTwo({
                        stdVarGreenHit: zVal2,
                        stdVarProximity: zVal1,
                        stdVarPoorShot: zVal3,
                        fixed: APPROACH_FIXED_VALUE[$selected][activeApproachType],
                        coefficientGreenHit:
                            APPROACH_GREEN_HIT_PERCENTAGE_COEFFICIENT[$selected][
                                activeApproachType
                            ],
                        coefficientProximity:
                            APPROACH_PROXIMITY_COEFFICIENT[$selected][activeApproachType],
                        coefficientPoorShot:
                            APPROACH_POOR_SHOT_PERCENTAGE_COEFFICIENT[$selected][
                                activeApproachType
                            ],
                    });
            }
        }
    }
</script>

<div class="mb-6 flex">
    <DataTabs
        tabOptions={Object.values(ApproachDistanceBucket)}
        bind:activeTab={activeApproachType}
    />
</div>

<div class="grid gap-6 lg:grid-cols-4">
    <BarCardToggle
        title="Average Strokes Gained"
        subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
        tabData={kpiTabData}
        tabOptions={Object.values(ApproachType)}
        bind:activeTab={activeRoundOrShot}
        bind:selected
    />

    <div class="shadow-card rounded-lg border border-neutral-100 lg:col-span-3">
        <div class="items-center justify-between border-b border-neutral-100 px-6 py-4 sm:flex">
            <h4 class="text-xl font-medium">Approach</h4>

            <div class="mt-2 flex gap-2 sm:mt-0">
                {#key `${activeApproachType}-${$selected}`}
                    <BenchmarkModal
                        value1={$value1}
                        {type1}
                        value2={$value2}
                        {type2}
                        value3={$value3}
                        {type3}
                        value4={undefined}
                        type4={undefined}
                        predictors={data.predictors}
                        benchmarks={data.benchmarks}
                        golfers={data.golfers}
                    />
                {/key}
                {#key `${activeApproachType}-${$selected}`}
                    <BenchmarkPersonal
                        value1={$value1}
                        {type1}
                        value2={$value2}
                        {type2}
                        value3={$value3}
                        {type3}
                        value4={undefined}
                        type4={undefined}
                        predictors={data.predictors}
                        benchmarks={data.benchmarks}
                    />
                {/key}
            </div>
        </div>

        <div class="px-6 pb-6 pt-4">
            <!-- <SGPBar strokesGained={getSGPBarData(activeApproachType, $selected)} /> -->
            <SGPBar
                strokesGained={modifiedStrokesGainedPredictorValue[$selected][activeApproachType]}
            />

            <div class="flex flex-col gap-2">
                {#each getBarData(activeApproachType, $selected) as item}
                    {@const benchmark = data.predictors.find((p) => p.type === item.type)}
                    {#key `${activeApproachType}-${$selected}-${item.title}`}
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
