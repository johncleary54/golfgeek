import type { Actions, PageServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";
import { ApproachDistanceBucket } from "$lib/types";
import { fail } from "@sveltejs/kit";
import {
    clearPredictors,
    createPersonal,
    updatePredictors,
} from "$lib/server/predictor/predictor.service";

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        avgSPRApproachFairway,
        avgSPRApproachRough,
        averageSGApproachFairwayDistanceBuckets,
        averageSGApproachRoughDistanceBuckets,
        averageAdjustedApproachProximity,
        averageAdjustedGreenHitPercentages,
        poorAppShotPercentages,
    } = calculator.calcSGPApproach();

    function calcStandardisedVariable(value: number, mean: number, stdDev: number): number {
        return (value - mean) / stdDev;
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

    const SGPData: {
        fairway: {
            [key in ApproachDistanceBucket]: number;
        };
        rough: {
            [key in ApproachDistanceBucket]: number;
        };
    } = {
        fairway: {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        },
        rough: {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        },
    };

    SGPData.fairway[ApproachDistanceBucket.Approach_101_150] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.fairwayValues[
                ApproachDistanceBucket.Approach_101_150
            ],
            0,
            0.059325905,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.fairwayValues[ApproachDistanceBucket.Approach_101_150],
            0,
            0.7839,
        ),
        fixed: 0.024408103,
        coefficientGreenHit: 0.02020912,
        coefficientProximity: -0.044270836,
    });

    SGPData.fairway[ApproachDistanceBucket.Approach_151_200] = calcModelEquationTwo({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.fairwayValues[
                ApproachDistanceBucket.Approach_151_200
            ],
            0,
            0.078932,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.fairwayValues[ApproachDistanceBucket.Approach_151_200],
            0,
            0.816118,
        ),
        stdVarPoorShot: calcStandardisedVariable(
            poorAppShotPercentages.fairway[ApproachDistanceBucket.Approach_151_200] / 100,
            0.074967532,
            0.030242,
        ),
        fixed: 0.01770536,
        coefficientGreenHit: 0.024929593,
        coefficientProximity: -0.023897126,
        coefficientPoorShot: -0.018068041,
    });

    SGPData.fairway[ApproachDistanceBucket.Approach_201_250] = calcModelEquationTwo({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.fairwayValues[
                ApproachDistanceBucket.Approach_201_250
            ],
            0,
            0.092254,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.fairwayValues[ApproachDistanceBucket.Approach_201_250],
            0,
            1.409021,
        ),
        stdVarPoorShot: calcStandardisedVariable(
            poorAppShotPercentages.fairway[ApproachDistanceBucket.Approach_201_250] / 100,
            0.063,
            0.028938,
        ),
        fixed: 0.006130076,
        coefficientGreenHit: 0.030278777,
        coefficientProximity: -0.015153527,
        coefficientPoorShot: -0.027684859,
    });

    SGPData.fairway[ApproachDistanceBucket.Approach_251Plus] = calcModelEquationTwo({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.fairwayValues[
                ApproachDistanceBucket.Approach_251Plus
            ],
            0,
            0.047162376,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.fairwayValues[ApproachDistanceBucket.Approach_251Plus],
            0,
            10.50616638,
        ),
        stdVarPoorShot: calcStandardisedVariable(
            poorAppShotPercentages.fairway[ApproachDistanceBucket.Approach_251Plus] / 100,
            0.053804878,
            0.034784504,
        ),
        fixed: 0.054997491,
        coefficientGreenHit: 0.020334622,
        coefficientProximity: -0.03357657,
        coefficientPoorShot: -0.046529046,
    });

    SGPData.rough[ApproachDistanceBucket.Approach_101_150] = calcModelEquation({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.roughValues[ApproachDistanceBucket.Approach_101_150],
            0,
            0.0769,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.roughValues[ApproachDistanceBucket.Approach_101_150],
            0,
            1.76,
        ),
        fixed: 0.04020248,
        coefficientGreenHit: 0.027771628,
        coefficientProximity: -0.043847535,
    });

    SGPData.rough[ApproachDistanceBucket.Approach_151_200] = calcModelEquationTwo({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.roughValues[ApproachDistanceBucket.Approach_151_200],
            0,
            0.09363,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.roughValues[ApproachDistanceBucket.Approach_151_200],
            0,
            2.820619,
        ),
        stdVarPoorShot: calcStandardisedVariable(
            poorAppShotPercentages.rough[ApproachDistanceBucket.Approach_151_200] / 100,
            0.041356,
            0.026267,
        ),
        fixed: 0.05644054,
        coefficientGreenHit: 0.03598722,
        coefficientProximity: -0.0383547,
        coefficientPoorShot: -0.0171117,
    });

    SGPData.rough[ApproachDistanceBucket.Approach_201_250] = calcModelEquationTwo({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.roughValues[ApproachDistanceBucket.Approach_201_250],
            0,
            0.09363,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.roughValues[ApproachDistanceBucket.Approach_201_250],
            0,
            2.820619,
        ),
        stdVarPoorShot: calcStandardisedVariable(
            poorAppShotPercentages.rough[ApproachDistanceBucket.Approach_201_250] / 100,
            0.045333333,
            0.026267,
        ),
        fixed: 0.07231211,
        coefficientGreenHit: 0.03393214,
        coefficientProximity: -0.0370961,
        coefficientPoorShot: -0.0281285,
    });

    SGPData.rough[ApproachDistanceBucket.Approach_251Plus] = calcModelEquationTwo({
        stdVarGreenHit: calcStandardisedVariable(
            averageAdjustedGreenHitPercentages.roughValues[ApproachDistanceBucket.Approach_251Plus],
            0,
            0.031819893,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedApproachProximity.roughValues[ApproachDistanceBucket.Approach_251Plus],
            0,
            17.66041854,
        ),
        stdVarPoorShot: calcStandardisedVariable(
            poorAppShotPercentages.rough[ApproachDistanceBucket.Approach_251Plus] / 100,
            0.035516224,
            0.025610676,
        ),
        fixed: 0.03975417,
        coefficientGreenHit: 0.01944813,
        coefficientProximity: -0.0455256,
        coefficientPoorShot: -0.0263115,
    });

    return {
        avgSPRApproachFairway,
        avgSPRApproachRough,
        averageSGApproachFairwayDistanceBuckets,
        averageSGApproachRoughDistanceBuckets,
        averageAdjustedApproachProximity,
        averageAdjustedGreenHitPercentages,
        poorAppShotPercentages,
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
