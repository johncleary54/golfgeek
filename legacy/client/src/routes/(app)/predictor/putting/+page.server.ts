import type { Actions, PageServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";
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
        averageSGPuttingDistanceBuckets,
        adjustedOnePuttPercentages,
        adjustedOnePuttAverages,
        averageAdjustedProximity,
        averageAdjustedProximityValue,
        averageShotsPerRoundPuttingDistanceBuckets,
    } = calculator.calcSGPPutting();

    function calcStandardisedVariable(value: number, mean: number, stdDev: number): number {
        return (value - mean) / stdDev;
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

    // convert each value of averageAdjustedProximityValue to yards by dividing by 3
    const averageAdjustedProximityValueYards: Record<string, number> = {};
    for (const [key, value] of Object.entries(averageAdjustedProximityValue)) {
        averageAdjustedProximityValueYards[key] = value / 3;
    }

    const SGPData: Record<
        "0-2" | "3-5" | "6-9" | "10-15" | "16-25" | "26-40" | "41-60" | "61+",
        number
    > = {
        "0-2": 0,
        "3-5": 0,
        "6-9": 0,
        "10-15": 0,
        "16-25": 0,
        "26-40": 0,
        "41-60": 0,
        "61+": 0,
    };

    SGPData["0-2"] = calcModelEquationOnePutt({
        stdVar: calcStandardisedVariable(adjustedOnePuttAverages["0-2"] ?? 0, 0, 0.002463),
        fixed: -0.00054134,
        coefficient: 0.00274409,
    });

    SGPData["3-5"] = calcModelEquationOnePutt({
        stdVar: calcStandardisedVariable(adjustedOnePuttAverages["3-5"] ?? 0, 0, 0.04199531),
        fixed: 0.00390151127827658,
        coefficient: 0.0426281410248283,
    });

    SGPData["6-9"] = calcModelEquationOnePutt({
        stdVar: calcStandardisedVariable(adjustedOnePuttAverages["6-9"] ?? 0, 0, 0.07560884),
        fixed: -0.00202189701372291,
        coefficient: 0.0762466518710783,
    });
    SGPData["10-15"] = calcModelEquationOnePutt({
        stdVar: calcStandardisedVariable(adjustedOnePuttAverages["10-15"] ?? 0, 0, 0.065672644),
        fixed: 0.00239398056029385,
        coefficient: 0.0662018698478175,
    });

    SGPData["16-25"] = calcModelEquationOnePuttAndProximity({
        stdVarOnePutt: calcStandardisedVariable(
            adjustedOnePuttAverages["16-25"] ?? 0,
            0,
            0.048625639,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedProximityValueYards["16-25"] ?? 0,
            0,
            0.06433587,
        ),
        fixed: 0.0038338289847047,
        coefficientOnePutt: 0.0461035708189411,
        coefficientProximity: -0.00755844140609056,
    });
    SGPData["26-40"] = calcModelEquationOnePuttAndProximity({
        stdVarOnePutt: calcStandardisedVariable(
            adjustedOnePuttAverages["26-40"] ?? 0,
            0,
            0.036007966,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedProximityValueYards["26-40"] ?? 0,
            0,
            0.091763273,
        ),
        fixed: 0.0031338479759019,
        coefficientOnePutt: 0.0331457693724748,
        coefficientProximity: -0.0156581315435644,
    });
    SGPData["41-60"] = calcModelEquationOnePuttAndProximity({
        stdVarOnePutt: calcStandardisedVariable(
            adjustedOnePuttAverages["41-60"] ?? 0,
            0,
            0.01846949,
        ),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedProximityValueYards["41-60"] ?? 0,
            0,
            0.116168484,
        ),
        fixed: -0.000502562543504113,
        coefficientOnePutt: 0.0171619430995169,
        coefficientProximity: -0.0203785754306051,
    });

    SGPData["61+"] = calcModelEquationOnePuttAndProximity({
        stdVarOnePutt: calcStandardisedVariable(adjustedOnePuttAverages["61+"] ?? 0, 0, 0.017311),
        stdVarProximity: calcStandardisedVariable(
            averageAdjustedProximityValueYards["61+"] ?? 0,
            0,
            0.303816,
        ),
        fixed: 0.028798532,
        coefficientOnePutt: 0.017173918,
        coefficientProximity: -0.053685136,
    });

    return {
        averageSGPuttingDistanceBuckets,
        averageShotsPerRoundPuttingDistanceBuckets,
        adjustedOnePuttPercentages,
        averageAdjustedProximity,
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
