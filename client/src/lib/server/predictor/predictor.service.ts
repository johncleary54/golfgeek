import type PocketBase from "pocketbase";
import { safe, type Safe } from "../safe.service";
import { z } from "zod";
import { PredictorType } from "../../../routes/(app)/predictor/predictor.type";
import { createOrUpdatePresonalBenchmark, getAllBenchmarks } from "./benchmark.service";

export const predictorSchema = z.object({
    id: z.string(),
    userId: z.string(),
    benchmarkId: z.string().optional(),
    type: z.nativeEnum(PredictorType),
    value: z.number(),
});

export type Predictor = z.infer<typeof predictorSchema>;

export function toPojo(val: Predictor[]): Predictor[] {
    return val.map((el) => {
        return {
            id: el.id,
            userId: el.userId,
            benchmarkId: el.benchmarkId,
            type: el.type,
            value: el.value,
        };
    });
}

export async function getAllPredictors(pb: PocketBase, userId: string): Promise<Safe<Predictor[]>> {
    const predictors = await safe(
        pb.collection("predictors").getFullList<Predictor>({
            filter: `userId = "${userId}"`,
        }),
    );
    if (!predictors.success) return { error: predictors.error, success: false };
    return { data: toPojo(predictors.data), success: true };
}

export async function updatePredictor(
    pb: PocketBase,
    userId: string,
    type: PredictorType,
    benchmarkId: string | undefined,
    value: number,
): Promise<Safe<void>> {
    // Delete old predictor
    const active = await safe(
        pb
            .collection("predictors")
            .getFirstListItem<Predictor>(`userId = "${userId}" && type = "${type}"`),
    );
    if (active.success) {
        const deleted = await safe(pb.collection("predictors").delete(active.data.id));
        if (!deleted.success) return { error: deleted.error, success: false };
    }

    // Create new predictor
    const created = await safe(
        pb.collection("predictors").create({
            userId,
            benchmarkId: benchmarkId,
            type: type,
            value: value,
        }),
    );
    if (!created.success) return { error: created.error, success: false };

    return { success: true, data: undefined };
}

export async function createPersonal(locals: App.Locals, request: Request): Promise<Safe<void>> {
    const form = await request.formData();
    // TODO - refactor, zod validation
    const value1 = form.get("value1") as unknown as number | undefined;
    const type1 = form.get("type1") as PredictorType | undefined;
    const value2 = form.get("value2") as unknown as number | undefined;
    const type2 = form.get("type2") as PredictorType | undefined;
    const value3 = form.get("value3") as unknown as number | undefined;
    const type3 = form.get("type3") as PredictorType | undefined;
    const value4 = form.get("value4") as unknown as number | undefined;
    const type4 = form.get("type4") as PredictorType | undefined;
    const isPersonal = form.get("isPersonal") === "true";

    const valuesArr: number[] = [];
    const predictors: PredictorType[] = [];

    if (value1 && type1) {
        valuesArr.push(value1);
        predictors.push(type1);
    }
    if (value2 && type2) {
        valuesArr.push(value2);
        predictors.push(type2);
    }
    if (value3 && type3) {
        valuesArr.push(value3);
        predictors.push(type3);
    }
    if (value4 && type4) {
        valuesArr.push(value4);
        predictors.push(type4);
    }

    let i = 0;
    for (const predictor of predictors) {
        const value = Number(valuesArr[i]);
        if (!value || isNaN(value)) {
            return { success: false, error: "Invalid value" };
        }
        const res = await createOrUpdatePresonalBenchmark(
            locals.pb,
            locals.user.id,
            predictor,
            value,
        );
        if (!res.success) {
            return { success: false, error: res.error };
        }

        if (isPersonal) {
            const pre = await updatePredictor(
                locals.pb,
                locals.user.id,
                predictor,
                res.data.id,
                res.data.value,
            );
            if (!pre.success) {
                return { success: false, error: pre.error };
            }
        }
        i++;
    }
    return { success: true, data: undefined };
}

export async function updatePredictors(locals: App.Locals, request: Request): Promise<Safe<void>> {
    const form = await request.formData();
    // TODO -REFRACTOR and zod validation
    const name = form.get("name");
    const value1 = form.get("value1") as unknown as number | undefined;
    const type1 = form.get("type1") as PredictorType | undefined;
    const value2 = form.get("value2") as unknown as number | undefined;
    const type2 = form.get("type2") as PredictorType | undefined;
    const value3 = form.get("value3") as unknown as number | undefined;
    const type3 = form.get("type3") as PredictorType | undefined;
    const value4 = form.get("value4") as unknown as number | undefined;
    const type4 = form.get("type4") as PredictorType | undefined;

    const valuesArr: number[] = [];
    const predictors: PredictorType[] = [];

    if (value1 && type1) {
        valuesArr.push(value1);
        predictors.push(type1);
    }
    if (value2 && type2) {
        valuesArr.push(value2);
        predictors.push(type2);
    }
    if (value3 && type3) {
        valuesArr.push(value3);
        predictors.push(type3);
    }
    if (value4 && type4) {
        valuesArr.push(value4);
        predictors.push(type4);
    }

    const benchmarks = await getAllBenchmarks(locals.pb, locals.user.id);
    if (!benchmarks.success) {
        return { success: false, error: benchmarks.error };
    }

    for (const type of predictors) {
        const benchmark = benchmarks.data.find((el) => el.name === name && el.type === type);
        if (!benchmark) {
            return { success: false, error: "No benchmark found" };
        }
        const res = await updatePredictor(
            locals.pb,
            locals.user.id,
            type,
            benchmark.id,
            benchmark.value,
        );
        if (!res.success) {
            return { success: false, error: res.error };
        }
    }
    return {
        success: true,
        data: undefined,
    };
}

export async function clearPredictors(locals: App.Locals, request: Request): Promise<Safe<void>> {
    const form = await request.formData();
    const type1 = form.get("type1") as PredictorType | undefined;
    const type2 = form.get("type2") as PredictorType | undefined;
    const type3 = form.get("type3") as PredictorType | undefined;
    const type4 = form.get("type4") as PredictorType | undefined;

    const userPredictors = await getAllPredictors(locals.pb, locals.user.id);
    if (!userPredictors.success) {
        return { success: false, error: userPredictors.error };
    }

    const predictors: PredictorType[] = [];
    if (type1) predictors.push(type1);
    if (type2) predictors.push(type2);
    if (type3) predictors.push(type3);
    if (type4) predictors.push(type4);
    for (const predictor of predictors) {
        const predictorToDelete = userPredictors.data.find((el) => el.type === predictor);
        if (!predictorToDelete) {
            return { success: false, error: "No predictor found" };
        }
        const deleted = await safe(locals.pb.collection("predictors").delete(predictorToDelete.id));
        if (!deleted.success) {
            return { success: false, error: deleted.error };
        }
    }
    return { success: true, data: undefined };
}
