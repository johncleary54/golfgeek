import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
    clearPredictors,
    createPersonal,
    updatePredictors,
} from "$lib/server/predictor/predictor.service";
import { Calculator } from "$lib/server/calculator/MainCalculator";
import { ShortGameDistanceBucket } from "$lib/types";

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        avgSPRShortGameFairway,
        avgSPRShortGameRough,
        avgSPRShortGameSand,
        averageSGFairwayShortGameDistanceBuckets,
        averageSGRoughShortGameDistanceBuckets,
        averageSGSandShortGameDistanceBuckets,
        avgShortGameProximities,
        avgShortGameGreenHitPercentages,
        adjustedHoleOutPercentages,
        adjustedHoleOutAverages,
    } = calculator.calcSGPShortGame();

    function calcStandardisedVariable(value: number, mean: number, stdDev: number): number {
        return (value - mean) / stdDev;
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

    const SGPData: {
        fairway: {
            [key in ShortGameDistanceBucket]: number;
        };
        rough: {
            [key in ShortGameDistanceBucket]: number;
        };
        sand: {
            [key in ShortGameDistanceBucket]: number;
        };
    } = {
        fairway: {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        },
        rough: {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        },
        sand: {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        },
    };

    SGPData.fairway[ShortGameDistanceBucket.ShortGame_0_25] = calcModelEquationFairwayLessThan25({
        stdVarHoleOut: calcStandardisedVariable(
            adjustedHoleOutAverages[ShortGameDistanceBucket.ShortGame_0_25],
            0,
            0.015604,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.fairwayValues[ShortGameDistanceBucket.ShortGame_0_25],
            0,
            0.209279,
        ),
        fixed: 0.01151221,
        coefficientHoleOut: 0.014966581,
        coefficientProximity: -0.026219498,
    });

    SGPData.fairway[ShortGameDistanceBucket.ShortGame_26_50] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.fairwayValues[ShortGameDistanceBucket.ShortGame_26_50],
            0,
            0.036938566,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.fairwayValues[ShortGameDistanceBucket.ShortGame_26_50],
            0,
            0.534470475,
        ),
        fixed: 0.04760173,
        coefficientGreenHit: 0.0114704,
        coefficientProximity: -0.0417554,
    });

    SGPData.fairway[ShortGameDistanceBucket.ShortGame_51_75] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.fairwayValues[ShortGameDistanceBucket.ShortGame_51_75],
            0,
            0.047277734,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.fairwayValues[ShortGameDistanceBucket.ShortGame_51_75],
            0,
            0.750645499,
        ),
        fixed: 0.044804678,
        coefficientGreenHit: 0.013356393,
        coefficientProximity: -0.050215692,
    });

    SGPData.fairway[ShortGameDistanceBucket.ShortGame_76_100] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.fairwayValues[ShortGameDistanceBucket.ShortGame_76_100],
            0,
            0.055068952,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.fairwayValues[ShortGameDistanceBucket.ShortGame_76_100],
            0,
            0.635846045,
        ),
        fixed: 0.0320348,
        coefficientGreenHit: 0.01113804,
        coefficientProximity: -0.0373824,
    });

    SGPData.rough[ShortGameDistanceBucket.ShortGame_0_25] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.roughValues[ShortGameDistanceBucket.ShortGame_0_25],
            0,
            0.038755949,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.roughValues[ShortGameDistanceBucket.ShortGame_0_25],
            0,
            0.649741922,
        ),
        fixed: 0.12449234,
        coefficientGreenHit: 0.01635921,
        coefficientProximity: -0.0587059,
    });

    SGPData.rough[ShortGameDistanceBucket.ShortGame_26_50] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.roughValues[ShortGameDistanceBucket.ShortGame_26_50],
            0,
            0.079594943,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.roughValues[ShortGameDistanceBucket.ShortGame_26_50],
            0,
            1.209892747,
        ),
        fixed: 0.13394826,
        coefficientGreenHit: 0.01936278,
        coefficientProximity: -0.075684,
    });

    SGPData.rough[ShortGameDistanceBucket.ShortGame_51_75] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.roughValues[ShortGameDistanceBucket.ShortGame_51_75],
            0,
            0.097561,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.roughValues[ShortGameDistanceBucket.ShortGame_51_75],
            0,
            2.022604,
        ),
        fixed: 0.06962778,
        coefficientGreenHit: 0.04035264,
        coefficientProximity: -0.0648795,
    });

    SGPData.rough[ShortGameDistanceBucket.ShortGame_76_100] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.roughValues[ShortGameDistanceBucket.ShortGame_76_100],
            0,
            0.090957,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.roughValues[ShortGameDistanceBucket.ShortGame_76_100],
            0,
            1.902578,
        ),
        fixed: 0.01192564,
        coefficientGreenHit: 0.04300832,
        coefficientProximity: -0.0483149,
    });

    SGPData.sand[ShortGameDistanceBucket.ShortGame_0_25] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            avgShortGameGreenHitPercentages.sandValues[ShortGameDistanceBucket.ShortGame_0_25],
            0,
            0.04434,
        ),
        stdVarProximity: calcStandardisedVariable(
            avgShortGameProximities.sandValues[ShortGameDistanceBucket.ShortGame_0_25],
            0,
            0.485423,
        ),
        fixed: 0.02025253,
        coefficientGreenHit: 0.0158567,
        coefficientProximity: -0.0426544,
    });

    return {
        avgSPRShortGameFairway,
        avgSPRShortGameRough,
        avgSPRShortGameSand,
        averageSGFairwayShortGameDistanceBuckets,
        averageSGRoughShortGameDistanceBuckets,
        averageSGSandShortGameDistanceBuckets,
        avgShortGameProximities,
        avgShortGameGreenHitPercentages,
        adjustedHoleOutPercentages,
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
