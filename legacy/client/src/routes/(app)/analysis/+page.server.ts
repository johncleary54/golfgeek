import { Calculator } from "$lib/server/calculator/MainCalculator";
import type { PageServerLoad } from "./$types";

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        averageSGForAllRounds,
        averageSGOTTForAllRounds,
        averageSGApproachForAllRounds,
        averageSGShortGameForAllRounds,
        averageSGPuttingForAllRounds,
        overviewChartData,
        overviewLabels,
        averageFirst6HolesScore,
        averageMiddle6HolesScore,
        averageLast6HolesScore,
        fullRoundsAmount,
        averagePar3HolesScore,
        averagePar4HolesScore,
        averagePar5HolesScore,
    } = calculator.calcAnalysisOverview();

    return {
        averageSGForAllRounds,
        averageSGOTTForAllRounds,
        averageSGApproachForAllRounds,
        averageSGShortGameForAllRounds,
        averageSGPuttingForAllRounds,
        overviewChartData,
        overviewLabels,
        averageFirst6HolesScore,
        averageMiddle6HolesScore,
        averageLast6HolesScore,
        fullRoundsAmount,
        averagePar3HolesScore,
        averagePar4HolesScore,
        averagePar5HolesScore,
    };
}) satisfies PageServerLoad;
