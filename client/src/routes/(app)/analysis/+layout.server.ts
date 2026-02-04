import type { LayoutServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds, roundsAmount } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        fairwayAccuracyPercentage,
        poorTeeShotsPercentage,
        penaltyPercentage,
        averageSGForAllRounds,
    } = calculator.calcAnalysis();

    return {
        fairwayAccuracyPercentage,
        poorTeeShotsPercentage,
        penaltyPercentage,
        averageSGForAllRounds,
        roundsAmount,
    };
}) satisfies LayoutServerLoad;
