import type { PageServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";
import { ApproachDistanceBucket } from "$lib/types";

type ApproachDistanceBucketData = {
    title: string;
    max: number;
    current: number;
    suffix: string;
    goal: string;
    tooltip: string;
};

type KpMetricsData = {
    fairway: Record<ApproachDistanceBucket, ApproachDistanceBucketData[]>;
    rough: Record<ApproachDistanceBucket, ApproachDistanceBucketData[]>;
};

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        averageSGApproachForAllRounds,
        approachChartData,
        approachLabels,
        avgSPRApproachFairway,
        avgSPRApproachRough,
        averageSGApproachFairwayDistanceBuckets,
        averageSGApproachRoughDistanceBuckets,
        averageSGApproachDistanceBuckets,
        averageAdjustedApproachProximity,
        averageAdjustedGreenHitPercentages,
        poorAppShotPercentages,
        tableDataApproach,
    } = calculator.calcAnalysisApproach();

    const kpMetricsData: KpMetricsData = {
        fairway: {
            [ApproachDistanceBucket.Approach_101_150]: [
                {
                    title: "Proximity (ft)",
                    max: 50,
                    current: +(averageAdjustedApproachProximity.fairway["101-150"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Average proximity (ft)",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.fairway["101-150"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Green hit %",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.fairway["101-150"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Poor approach shot %",
                },
            ],
            [ApproachDistanceBucket.Approach_151_200]: [
                {
                    title: "Proximity (ft)",
                    max: 125,
                    current: +(averageAdjustedApproachProximity.fairway["151-200"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.fairway["151-200"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.fairway["151-200"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ApproachDistanceBucket.Approach_201_250]: [
                {
                    title: "Proximity (ft)",
                    max: 150,
                    current: +(averageAdjustedApproachProximity.fairway["201-250"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.fairway["201-250"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.fairway["201-250"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ApproachDistanceBucket.Approach_251Plus]: [
                {
                    title: "Proximity (ft)",
                    max: 200,
                    current: +(averageAdjustedApproachProximity.fairway["251+"] * 3).toFixed(2),
                    suffix: "yds",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.fairway["251+"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.fairway["251+"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
        },
        rough: {
            [ApproachDistanceBucket.Approach_101_150]: [
                {
                    title: "Proximity (ft)",
                    max: 50,
                    current: +(averageAdjustedApproachProximity.rough["101-150"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.rough["101-150"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.rough["101-150"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ApproachDistanceBucket.Approach_151_200]: [
                {
                    title: "Proximity (ft)",
                    max: 125,
                    current: +(averageAdjustedApproachProximity.rough["151-200"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.rough["151-200"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.rough["151-200"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ApproachDistanceBucket.Approach_201_250]: [
                {
                    title: "Proximity (ft)",
                    max: 150,
                    current: +(averageAdjustedApproachProximity.rough["201-250"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.rough["201-250"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.rough["201-250"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ApproachDistanceBucket.Approach_251Plus]: [
                {
                    title: "Proximity (ft)",
                    max: 200,
                    current: +(averageAdjustedApproachProximity.rough["251+"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: averageAdjustedGreenHitPercentages.rough["251+"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Approach Shot (%)",
                    max: 100,
                    current: poorAppShotPercentages.rough["251+"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
        },
    };

    const tableColumns = [
        "DISTANCE (yds)",
        "SG/ROUND",
        "SG/SHOT",
        // "AVG PROXIMITY (yds)",
        "GREEN HIT (%)",
        "POOR SHOT (%)",
        "GREAT SHOT (%)",
        "FREQUENCY",
        "TOTAL SHOTS",
        "SHOTS/ROUND",
    ];

    return {
        averageSGApproachForAllRounds,
        approachChartData,
        approachLabels,
        avgSPRApproachFairway,
        avgSPRApproachRough,
        averageSGApproachFairwayDistanceBuckets,
        averageSGApproachRoughDistanceBuckets,
        averageSGApproachDistanceBuckets,
        kpMetricsData,
        tableColumns,
        tableDataApproach,
    };
}) satisfies PageServerLoad;
