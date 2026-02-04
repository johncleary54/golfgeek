import {
    clearPredictors,
    createPersonal,
    updatePredictors,
} from "$lib/server/predictor/predictor.service";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        averageSGOTTForAllRounds,
        averageSGOTTForAllShots,
        avgSPRTeeShots,
        avgAdjustedTeeShotDistance,
        avgAdjustedTeeShotValue,
        fairwayAccuracyPercentage,
        poorTeeShotsPercentage,
    } = calculator.calcSGPOffTheTee();

    function calcStandardisedVariable(value: number, mean: number, stdDev: number): number {
        return (value - mean) / stdDev;
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

    const stdVarDistance = calcStandardisedVariable(avgAdjustedTeeShotValue, 0, 7.477419);

    const stdVarFairwayAccuracy = calcStandardisedVariable(
        fairwayAccuracyPercentage / 100,
        0.65,
        0.053521,
    );

    const stdVarPoorTeeShots = calcStandardisedVariable(
        poorTeeShotsPercentage / 100,
        0.04722,
        0.016925,
    );

    const SGPData: number =
        calcModelEquation({
            stdVarDistance: stdVarDistance,
            stdVarFairwayAccuracy: stdVarFairwayAccuracy,
            stdVarPoorTeeShots: stdVarPoorTeeShots,
        }) || 0;

    return {
        averageSGOTTForAllRounds,
        averageSGOTTForAllShots,
        avgSPRTeeShots,
        //
        avgAdjustedTeeShotDistance,
        fairwayAccuracyPercentage,
        poorTeeShotsPercentage,
        //
        SGPData,
    };
}) satisfies PageServerLoad;

export const actions = {
    createPersonal: async ({ locals, request }) => {
        const res = await createPersonal(locals, request);
        if (!res.success) {
            return fail(400, { error: res.error });
        }
        return {
            success: true,
        };
    },
    updatePredictors: async ({ locals, request }) => {
        const res = await updatePredictors(locals, request);
        if (!res.success) {
            return fail(400, { error: res.error });
        }
        return {
            success: true,
        };
    },
    clearPredictors: async ({ locals, request }) => {
        const res = await clearPredictors(locals, request);
        if (!res.success) {
            return fail(400, { error: res.error });
        }
        return {
            success: true,
        };
    },
} satisfies Actions;
