<script lang="ts">
    import BenchmarkModal from "../components/BenchmarkModal.svelte";
    import SgpBar from "../components/SGPBar.svelte";
    import SliderWithInput from "../components/SliderWithInput.svelte";
    import type { ActionData, PageData } from "./$types";
    import { toast } from "$lib/components/toast/toast";
    import BarCardToggle from "$lib/components/BarCardToggle.svelte";
    import { showRoundOrShotData } from "$lib/utils";
    import { writable, type Writable } from "svelte/store";
    import BenchmarkPersonal from "../components/BenchmarkPersonal.svelte";
    import { PredictorType, type DataType } from "../predictor.type";

    export let data: PageData;
    export let form: ActionData;

    // LOGIC FOR SLIDER
    function calcStandardisedVariable(value: number, mean: number, stdDev: number): number {
        return (value - mean) / stdDev;
    }

    function calcNewValue(value: number, tourAvg: number): number {
        return value - tourAvg;
    }

    function calcModelEquation({
        stdVarDistance,
        stdVarFairwayAccuracy,
        stdVarPoorTeeShots,
    }: {
        stdVarDistance: number;
        stdVarFairwayAccuracy: number;
        stdVarPoorTeeShots: number;
    }): number {
        return +(
            -0.00316469804904481 +
            0.0318849537050303 * stdVarDistance +
            0.0146175847765727 * stdVarFairwayAccuracy +
            -0.0136050728551998 * stdVarPoorTeeShots
        ).toFixed(3);
    }
    //

    let modifiedStrokesGainedPredictorValue = data.SGPData;

    $: if (form?.error) {
        toast({
            message: form.error,
            type: "error",
        });
    }

    const dataT: DataType[] = [
        {
            title: "Driving distance, yds",
            tooltip: "Driving distance is the average distance of a player's drives",
            sliderValue: writable([data.avgAdjustedTeeShotDistance || 0]),
            predictorType: PredictorType.OffAverageDrivingDistance,
            unit: "yds",
            maxRange: 350,
        },
        {
            title: "Fairway accuracy, %",
            tooltip: "Fairway accuracy is the percentage of shots that land in the fairway",
            sliderValue: writable([data.fairwayAccuracyPercentage || 0]),
            predictorType: PredictorType.OffFairwayAccuracy,
            unit: "%",
            maxRange: 100,
        },
        {
            title: "Poor Tee Shot, %",
            tooltip: "The percentage of tee shots that gain -0.5 strokes or less",
            sliderValue: writable([data.poorTeeShotsPercentage || 0]),
            predictorType: PredictorType.OffPoorDrivePercentage,
            unit: "%",
            maxRange: 100,
        },
    ];

    let value1 = dataT[0]?.sliderValue;
    let type1 = dataT[0]?.predictorType;
    let value2 = dataT[1]?.sliderValue;
    let type2 = dataT[1]?.predictorType;
    let value3 = dataT[2]?.sliderValue;
    let type3 = dataT[2]?.predictorType;

    let barCardTabOptions: [string, string] = ["round", "shot"];
    let activeRoundOrShot = barCardTabOptions[0];

    let selected: Writable<string> = writable("Tee");

    $: val1Var = $value1?.[0] ?? 0;
    $: val2Var = $value2?.[0] ?? 0;
    $: val3Var = $value3?.[0] ?? 0;

    $: {
        if (val1Var <= 0 && val2Var <= 0 && val3Var <= 0) {
            modifiedStrokesGainedPredictorValue = 0;
        } else {
            let xVal1 = calcNewValue(val1Var, 289.55);
            let xVal2 = val2Var / 100;
            let xVal3 = val3Var / 100;

            const zVal1 = calcStandardisedVariable(xVal1, 0, 7.477419);

            const zVal2 = calcStandardisedVariable(xVal2, 0.65, 0.053521);

            const zVal3 = calcStandardisedVariable(xVal3, 0.04722, 0.016925);

            modifiedStrokesGainedPredictorValue = calcModelEquation({
                stdVarDistance: zVal1,
                stdVarFairwayAccuracy: zVal2,
                stdVarPoorTeeShots: zVal3,
            });
        }
    }
</script>

<div class="grid gap-6 lg:grid-cols-4">
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
    <div class="shadow-card rounded-lg border border-neutral-100 lg:col-span-3">
        <div class="items-center justify-between border-b border-neutral-100 px-6 py-4 sm:flex">
            <h4 class="text-xl font-medium">Off the tee</h4>

            <div class="mt-2 flex gap-2 sm:mt-0">
                {#key selected}
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
                {#key selected}
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
            <SgpBar strokesGained={modifiedStrokesGainedPredictorValue} />

            <hr class="my-6 border-neutral-100" />

            <div class="flex flex-col gap-2">
                {#each dataT as item}
                    {@const benchmark = data.predictors.find((p) => p.type === item.predictorType)}
                    <SliderWithInput
                        benchmark={benchmark?.value}
                        title={item.title}
                        tooltip={item.tooltip}
                        sliderValue={item.sliderValue}
                        unit={item.unit}
                        maxRange={item.maxRange}
                    />
                {/each}
            </div>
        </div>
    </div>
</div>
