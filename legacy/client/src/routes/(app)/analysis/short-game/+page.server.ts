import type { PageServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";
import { ShortGameDistanceBucket } from "$lib/types";

type ShortGameDistanceBucketData = {
    title: string;
    max: number;
    current: number;
    suffix: string;
    goal: string;
    tooltip: string;
};

type KpMetricsData = {
    fairway: Record<ShortGameDistanceBucket, ShortGameDistanceBucketData[]>;
    rough: Record<ShortGameDistanceBucket, ShortGameDistanceBucketData[]>;
    sand: Record<ShortGameDistanceBucket, ShortGameDistanceBucketData[]>;
};

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        averageSGShortGameForAllRounds,
        shortGameChartData,
        shortGameLabels,
        avgSPRShortGameFairway,
        avgSPRShortGameRough,
        avgSPRShortGameSand,
        averageSGFairwayShortGameDistanceBuckets,
        averageSGRoughShortGameDistanceBuckets,
        averageSGSandShortGameDistanceBuckets,
        averageSGShortGameDistanceBuckets,
        poorShortGameShotPercentages,
        greatShortGameShotPercentages,
        avgShortGameProximities,
        avgShortGameGreenHitPercentages,
        adjustedHoleOutPercentages,
        tableDataShortGame,
    } = calculator.calcAnalysisShortGame();

    const kpMetricsData: KpMetricsData = {
        fairway: {
            [ShortGameDistanceBucket.ShortGame_0_25]: [
                {
                    title: "Proximity (ft)",
                    max: 50,
                    current: +(avgShortGameProximities.fairway["0-25"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Hole Out (%)",
                    max: 100,
                    current: adjustedHoleOutPercentages["0-25"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_26_50]: [
                {
                    title: "Proximity (ft)",
                    max: 75,
                    current: +(avgShortGameProximities.fairway["26-50"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.fairway["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.fairway["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.fairway["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_51_75]: [
                {
                    title: "Proximity (ft)",
                    max: 100,
                    current: +(avgShortGameProximities.fairway["51-75"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.fairway["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.fairway["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.fairway["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_76_100]: [
                {
                    title: "Proximity (ft)",
                    max: 150,
                    current: +(avgShortGameProximities.fairway["76-100"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.fairway["76-100"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.fairway["76-100"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.fairway["76-100"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
        },
        rough: {
            [ShortGameDistanceBucket.ShortGame_0_25]: [
                {
                    title: "Proximity (ft)",
                    max: 50,
                    current: +(avgShortGameProximities.rough["0-25"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.rough["0-25"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.rough["0-25"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.rough["0-25"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_26_50]: [
                {
                    title: "Proximity (ft)",
                    max: 75,
                    current: +(avgShortGameProximities.rough["26-50"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.rough["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.rough["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.rough["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_51_75]: [
                {
                    title: "Proximity (ft)",
                    max: 100,
                    current: +(avgShortGameProximities.rough["51-75"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.rough["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.rough["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.rough["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_76_100]: [
                {
                    title: "Proximity (ft)",
                    max: 150,
                    current: +(avgShortGameProximities.rough["76-100"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.rough["76-100"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.rough["76-100"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.rough["76-100"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
        },
        sand: {
            [ShortGameDistanceBucket.ShortGame_0_25]: [
                {
                    title: "Proximity (ft)",
                    max: 50,
                    current: +(avgShortGameProximities.sand["0-25"] * 3).toFixed(2),
                    suffix: "ft",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.sand["0-25"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.sand["0-25"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.sand["0-25"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_26_50]: [
                {
                    title: "Proximity (yds)",
                    max: 350,
                    current: avgShortGameProximities.sand["26-50"],
                    suffix: "yds",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Green Hit %",
                    max: 100,
                    current: avgShortGameGreenHitPercentages.sand["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.sand["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.sand["26-50"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_51_75]: [
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.sand["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.sand["51-75"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
            ],
            [ShortGameDistanceBucket.ShortGame_76_100]: [
                {
                    title: "Great Short Game Shot (%)",
                    max: 100,
                    current: greatShortGameShotPercentages.sand["76-100"],
                    suffix: "%",
                    goal: "",
                    tooltip: "Tooltip",
                },
                {
                    title: "Poor Short Game Shot (%)",
                    max: 100,
                    current: poorShortGameShotPercentages.sand["76-100"],
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
        averageSGShortGameForAllRounds,
        shortGameChartData,
        shortGameLabels,
        avgSPRShortGameFairway,
        avgSPRShortGameRough,
        avgSPRShortGameSand,
        averageSGFairwayShortGameDistanceBuckets,
        averageSGRoughShortGameDistanceBuckets,
        averageSGSandShortGameDistanceBuckets,
        averageSGShortGameDistanceBuckets,
        poorShortGameShotPercentages,
        greatShortGameShotPercentages,
        kpMetricsData,
        tableColumns,
        tableDataShortGame,
    };
}) satisfies PageServerLoad;
