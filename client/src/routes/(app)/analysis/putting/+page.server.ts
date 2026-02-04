import type { PageServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        averageSGPuttingForAllRounds,
        averageSGPuttingLessThan10,
        averageSGPutting10_24,
        averageSGPutting25Plus,
        averageSGPuttingDistanceBuckets,
        puttingChartData,
        puttingLabels,
        adjustedOnePuttPercentages,
        averageAdjustedProximity,
        averageShotsPerRoundPuttingDistanceBuckets,
        tableDataPutting,
    } = calculator.calcAnalysisPutting();

    const zeroToTwoFt = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["0-2"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
    ];
    const threeToFiveFt = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["3-5"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
    ];
    const sixToNineFt = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["6-9"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
    ];
    const tenToFifteenFt = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["10-15"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
    ];
    const sixteenToTwentyFiveFt = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["16-25"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
        {
            title: "Average Proximity (ft)",
            max: 20,
            current: averageAdjustedProximity["16-25"] ?? 0,
            suffix: "ft",
            goal: "",
            tooltip: "Average proximity to the hole on putts in this distance range",
        },
    ];
    const twentySixToFortyFt = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["26-40"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
        {
            title: "Average Proximity (ft)",
            max: 20,
            current: averageAdjustedProximity["26-40"] ?? 0,
            suffix: "ft",
            goal: "",
            tooltip: "Average proximity to the hole on putts in this distance range",
        },
    ];
    const fortyOneToSixtyFt = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["41-60"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
        {
            title: "Average Proximity (ft)",
            max: 20,
            current: averageAdjustedProximity["41-60"] ?? 0,
            suffix: "ft",
            goal: "",
            tooltip: "Average proximity to the hole on putts in this distance range",
        },
    ];
    const sixtyOneFtPlus = [
        {
            title: "One Putt %",
            max: 100,
            current: adjustedOnePuttPercentages["61+"] ?? 0,
            suffix: "%",
            goal: "",
            tooltip: "The percentage of putts holed in this distance range",
        },
        {
            title: "Average Proximity (ft)",
            max: 20,
            current: averageAdjustedProximity["61+"] ?? 0,
            suffix: "ft",
            goal: "",
            tooltip: "Average proximity to the hole on putts in this distance range",
        },
    ];

    const tableColumns = [
        "DISTANCE (ft)",
        "SG/ROUND",
        "SG/SHOT",
        "1 PUTT (%)",
        "2 PUTT (%)",
        "3 PUTT (%)",
        // "AVG PROXIMITY (ft)",
        "FREQUENCY",
        "TOTAL SHOTS",
        "SHOTS/ROUND",
    ];

    return {
        averageSGPuttingForAllRounds,
        averageSGPuttingLessThan10,
        averageSGPutting10_24,
        averageSGPutting25Plus,
        averageSGPuttingDistanceBuckets,
        puttingChartData,
        puttingLabels,
        barData: {
            zeroToTwoFt,
            threeToFiveFt,
            sixToNineFt,
            tenToFifteenFt,
            sixteenToTwentyFiveFt,
            twentySixToFortyFt,
            fortyOneToSixtyFt,
            sixtyOneFtPlus,
        },
        averageShotsPerRoundPuttingDistanceBuckets,
        tableDataPutting,
        tableColumns,
    };
}) satisfies PageServerLoad;
