<script lang="ts">
    import DataTabs from "$lib/components/DataTabs.svelte";
    import BarCardToggle from "$lib/components/BarCardToggle.svelte";
    import SGPBar from "../components/SGPBar.svelte";
    import SliderWithInput from "../components/SliderWithInput.svelte";
    import type { ActionData, PageData } from "./$types";
    import { feetToYards, showRoundOrShotData } from "$lib/utils";
    import type { SliderData } from "$lib/types";
    import { toast } from "$lib/components/toast/toast";
    import { PredictorType } from "../predictor.type";
    import { writable, type Writable } from "svelte/store";
    import BenchmarkModal from "../components/BenchmarkModal.svelte";
    import BenchmarkPersonal from "../components/BenchmarkPersonal.svelte";
    import {
        ONE_PUTT_COEFFICIENT,
        ONE_PUTT_STDDEV,
        PROXIMITY_PUTTING_COEFFICIENT,
        PROXIMITY_PUTTING_STDDEV,
        PUTTING_FIXED_VALUE,
        TOUR_AVERAGES_ONE_PUTT,
        TOUR_AVERAGES_PROXIMITY_PUTTING_YARDS,
    } from "../../../../constants/predictorPutting";

    export let data: PageData;
    export let form: ActionData;

    // LOGIC
    function calcStandardisedVariable(value: number, mean: number, stdDev: number): number {
        return (value - mean) / stdDev;
    }

    function calcNewValue(value: number, tourAvg: number): number {
        return value - tourAvg;
    }

    function calcModelEquationOnePutt({
        stdVar,
        fixed,
        coefficient,
    }: {
        stdVar: number;
        fixed: number;
        coefficient: number;
    }): number {
        return +(fixed + coefficient * stdVar).toFixed(3);
    }

    function calcModelEquationOnePuttAndProximity({
        stdVarOnePutt,
        stdVarProximity,
        fixed,
        coefficientOnePutt,
        coefficientProximity,
    }: {
        stdVarOnePutt: number;
        stdVarProximity: number;
        fixed: number;
        coefficientOnePutt: number;
        coefficientProximity: number;
    }): number {
        return +(
            fixed +
            coefficientOnePutt * stdVarOnePutt +
            coefficientProximity * stdVarProximity
        ).toFixed(3);
    }
    //

    let modifiedStrokesGainedPredictorValue: Record<
        "0-2" | "3-5" | "6-9" | "10-15" | "16-25" | "26-40" | "41-60" | "61+",
        number
    > = data.SGPData;

    $: if (form?.error) {
        toast({
            message: form.error,
            type: "error",
        });
    }

    let tabOptions = ["short putts", "mid range putts", "long putts"];
    let barCardTabOptions: [string, string] = ["round", "shot"];
    let activePuttType = tabOptions[0] ?? "";
    let activeRoundOrShot = barCardTabOptions[0];
    let selected: Writable<"0-2" | "3-5" | "6-9" | "10-15" | "16-25" | "26-40" | "41-60" | "61+"> =
        writable("0-2");
    let roundSGData = data.averageSGPuttingDistanceBuckets.round;
    let shotSGData = data.averageSGPuttingDistanceBuckets.shot;

    const sliderData: Record<
        | "zeroToTwoFt"
        | "threeToFiveFt"
        | "sixToNineFt"
        | "tenToFifteenFt"
        | "sixteenToTwentyFiveFt"
        | "twentySixToFortyFt"
        | "fortyOneToSixtyFt"
        | "sixtyOneFtPlus",
        SliderData[]
    > = {
        zeroToTwoFt: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["0-2"] ?? 0]),
                type: PredictorType.Putting_2ft,
                unit: "%",
                maxRange: 100,
            },
        ],
        threeToFiveFt: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["3-5"] ?? 0]),
                type: PredictorType.Putting_3_5ft,
                unit: "%",
                maxRange: 100,
            },
        ],
        sixToNineFt: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["6-9"] ?? 0]),
                type: PredictorType.Putting_6_9ft,
                unit: "%",
                maxRange: 100,
            },
        ],
        tenToFifteenFt: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["10-15"] ?? 0]),
                type: PredictorType.Putting_10_15ft,
                unit: "%",
                maxRange: 100,
            },
        ],
        sixteenToTwentyFiveFt: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["16-25"] ?? 0]),
                type: PredictorType.Putting_16_25ft_One_Putt,
                unit: "%",
                maxRange: 100,
            },
            {
                title: "Average Proximity (ft)",
                tooltip: "Average Proximity (ft)",
                sliderValue: writable([data.averageAdjustedProximity["16-25"] ?? 0]),
                type: PredictorType.Putting_16_25ft_Average_Proximity,
                unit: "ft",
                maxRange: 10,
            },
        ],
        twentySixToFortyFt: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["26-40"] ?? 0]),
                type: PredictorType.Putting_26_40ft_One_Putt,
                unit: "%",
                maxRange: 100,
            },
            {
                title: "Average Proximity (ft)",
                tooltip: "Average Proximity (ft)",
                sliderValue: writable([data.averageAdjustedProximity["26-40"] ?? 0]),
                type: PredictorType.Putting_26_40ft_Average_Proximity,
                unit: "ft",
                maxRange: 10,
            },
        ],
        fortyOneToSixtyFt: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["41-60"] ?? 0]),
                type: PredictorType.Putting_41_60ft_One_Putt,
                unit: "%",
                maxRange: 100,
            },
            {
                title: "Average Proximity (ft)",
                tooltip: "Average Proximity (ft)",
                sliderValue: writable([data.averageAdjustedProximity["41-60"] ?? 0]),
                type: PredictorType.Putting_41_60ft_Average_Proximity,
                unit: "ft",
                maxRange: 10,
            },
        ],
        sixtyOneFtPlus: [
            {
                title: "One Putt %",
                tooltip: "One Putt %",
                sliderValue: writable([data.adjustedOnePuttPercentages["61+"] ?? 0]),
                type: PredictorType.Putting_61ft_Plus_One_Putt,
                unit: "%",
                maxRange: 100,
            },
            {
                title: "Average Proximity (ft)",
                tooltip: "Average Proximity (ft)",
                sliderValue: writable([data.averageAdjustedProximity["61+"] ?? 0]),
                type: PredictorType.Putting_61ft_Plus_Average_Proximity,
                unit: "ft",
                maxRange: 10,
            },
        ],
    };

    $: kpiTabData = [
        {
            id: 1,
            label: "0-2",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["0-2"], shotSGData["0-2"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["0-2"],
        },
        {
            id: 2,
            label: "3-5",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["3-5"], shotSGData["3-5"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["3-5"],
        },
        {
            id: 3,
            label: "6-9",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["6-9"], shotSGData["6-9"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["6-9"],
        },
        {
            id: 4,
            label: "10-15",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["10-15"],
                shotSGData["10-15"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["10-15"],
        },
        {
            id: 5,
            label: "16-25",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["16-25"],
                shotSGData["16-25"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["16-25"],
        },
        {
            id: 6,
            label: "26-40",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["26-40"],
                shotSGData["26-40"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["26-40"],
        },
        {
            id: 7,
            label: "41-60",
            value: showRoundOrShotData(
                activeRoundOrShot,
                roundSGData["41-60"],
                shotSGData["41-60"],
            ),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["41-60"],
        },
        {
            id: 8,
            label: "61+",
            value: showRoundOrShotData(activeRoundOrShot, roundSGData["61+"], shotSGData["61+"]),
            shotsPerRound: data.averageShotsPerRoundPuttingDistanceBuckets["61+"],
        },
    ];

    let activeKpiTabData = kpiTabData;
    $: if (activePuttType === "short putts") {
        activeKpiTabData = kpiTabData.filter((_, i) => i <= 2);
    } else if (activePuttType === "mid range putts") {
        activeKpiTabData = kpiTabData.filter((_, i) => i >= 3 && i <= 4);
    } else if (activePuttType === "long putts") {
        activeKpiTabData = kpiTabData.filter((_, i) => i >= 5);
    }

    function getBarData(
        selectedTab: "0-2" | "3-5" | "6-9" | "10-15" | "16-25" | "26-40" | "41-60" | "61+",
    ): SliderData[] {
        switch (selectedTab) {
            case "0-2":
                return sliderData.zeroToTwoFt;
            case "3-5":
                return sliderData.threeToFiveFt;
            case "6-9":
                return sliderData.sixToNineFt;
            case "10-15":
                return sliderData.tenToFifteenFt;
            case "16-25":
                return sliderData.sixteenToTwentyFiveFt;
            case "26-40":
                return sliderData.twentySixToFortyFt;
            case "41-60":
                return sliderData.fortyOneToSixtyFt;
            case "61+":
                return sliderData.sixtyOneFtPlus;
            default:
                return [];
        }
    }

    let value1: Writable<number[]> | undefined = sliderData.zeroToTwoFt[0]?.sliderValue;
    let type1: PredictorType | undefined = PredictorType.Putting_2ft;
    let value2: Writable<number[]> | undefined = undefined;
    let type2: PredictorType | undefined = undefined;

    // TODO - type this string
    $: if ($selected === "0-2") {
        value1 = sliderData.zeroToTwoFt[0]?.sliderValue;
        type1 = PredictorType.Putting_2ft;
        value2 = undefined;
        type2 = undefined;
    } else if ($selected === "3-5") {
        value1 = sliderData.threeToFiveFt[0]?.sliderValue;
        type1 = PredictorType.Putting_3_5ft;
        value2 = undefined;
        type2 = undefined;
    } else if ($selected === "6-9") {
        value1 = sliderData.sixToNineFt[0]?.sliderValue;
        type1 = PredictorType.Putting_6_9ft;
        value2 = undefined;
        type2 = undefined;
    } else if ($selected === "10-15") {
        value1 = sliderData.tenToFifteenFt[0]?.sliderValue;
        type1 = PredictorType.Putting_10_15ft;
        value2 = undefined;
        type2 = undefined;
    } else if ($selected === "16-25") {
        value1 = sliderData.sixteenToTwentyFiveFt[0]?.sliderValue;
        type1 = PredictorType.Putting_16_25ft_One_Putt;
        value2 = sliderData.sixteenToTwentyFiveFt[1]?.sliderValue;
        type2 = PredictorType.Putting_16_25ft_Average_Proximity;
    } else if ($selected === "26-40") {
        value1 = sliderData.twentySixToFortyFt[0]?.sliderValue;
        type1 = PredictorType.Putting_26_40ft_One_Putt;
        value2 = sliderData.twentySixToFortyFt[1]?.sliderValue;
        type2 = PredictorType.Putting_26_40ft_Average_Proximity;
    } else if ($selected === "41-60") {
        value1 = sliderData.fortyOneToSixtyFt[0]?.sliderValue;
        type1 = PredictorType.Putting_41_60ft_One_Putt;
        value2 = sliderData.fortyOneToSixtyFt[1]?.sliderValue;
        type2 = PredictorType.Putting_41_60ft_Average_Proximity;
    } else {
        value1 = sliderData.sixtyOneFtPlus[0]?.sliderValue;
        type1 = PredictorType.Putting_61ft_Plus_One_Putt;
        value2 = sliderData.sixtyOneFtPlus[1]?.sliderValue;
        type2 = PredictorType.Putting_61ft_Plus_Average_Proximity;
    }

    $: val1Var = $value1?.[0] ?? 0;
    $: val2Var = $value2?.[0] ?? 0;

    $: {
        /**
         * Mean is always 0 for both of these
         * TODO: Fix types + other TODO for TOUR_AVERAGES_PROXIMITY_PUTTING_YARDS which is in the file it's defined
         */

        if (val1Var <= 0 && val2Var <= 0) {
            modifiedStrokesGainedPredictorValue[$selected] = 0;
        } else {
            const xVal1 = calcNewValue(val1Var / 100, TOUR_AVERAGES_ONE_PUTT[$selected]);

            const xVal2 = calcNewValue(
                feetToYards(val2Var),
                TOUR_AVERAGES_PROXIMITY_PUTTING_YARDS[$selected],
            );

            const zVal1 = calcStandardisedVariable(xVal1, 0, ONE_PUTT_STDDEV[$selected]);

            const zVal2 = calcStandardisedVariable(xVal2, 0, PROXIMITY_PUTTING_STDDEV[$selected]);

            if (
                $selected === "0-2" ||
                $selected === "3-5" ||
                $selected === "6-9" ||
                $selected === "10-15"
            ) {
                modifiedStrokesGainedPredictorValue[$selected] = calcModelEquationOnePutt({
                    stdVar: zVal1,
                    fixed: PUTTING_FIXED_VALUE[$selected],
                    coefficient: ONE_PUTT_COEFFICIENT[$selected],
                });
            } else {
                modifiedStrokesGainedPredictorValue[$selected] =
                    calcModelEquationOnePuttAndProximity({
                        stdVarOnePutt: zVal1,
                        stdVarProximity: zVal2,
                        fixed: PUTTING_FIXED_VALUE[$selected],
                        coefficientOnePutt: ONE_PUTT_COEFFICIENT[$selected],
                        coefficientProximity: PROXIMITY_PUTTING_COEFFICIENT[$selected],
                    });
            }
        }
    }
</script>

<div class="mb-6 flex">
    <DataTabs {tabOptions} bind:activeTab={activePuttType} />
</div>

<div class="grid gap-6 lg:grid-cols-4">
    <BarCardToggle
        title="Average Strokes Gained"
        subtitle="{data.roundsAmount} Round{data.roundsAmount > 1 ? 's' : ''}"
        tabData={activeKpiTabData}
        tabOptions={barCardTabOptions}
        bind:activeTab={activeRoundOrShot}
        bind:selected
    />

    <div class="shadow-card rounded-lg border border-neutral-100 lg:col-span-3">
        <div class="items-center justify-between border-b border-neutral-100 px-6 py-4 sm:flex">
            <h4 class="text-xl font-medium">Putting</h4>

            <div class="mt-2 flex gap-2 sm:mt-0">
                {#key $selected}
                    <BenchmarkModal
                        value1={$value1}
                        {type1}
                        value2={$value2}
                        {type2}
                        value3={undefined}
                        type3={undefined}
                        value4={undefined}
                        type4={undefined}
                        golfers={data.golfers}
                        predictors={data.predictors}
                        benchmarks={data.benchmarks}
                    />
                {/key}
                {#key $selected}
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
            <SGPBar strokesGained={modifiedStrokesGainedPredictorValue[$selected]} />

            <hr class="my-6 border-neutral-100" />

            <div class="flex flex-col gap-2">
                {#each getBarData($selected) as item}
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
