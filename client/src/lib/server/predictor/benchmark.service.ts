import { z } from "zod";
import type PocketBase from "pocketbase";
import { safe, type Safe } from "../safe.service";
import { PredictorType } from "../../../routes/(app)/predictor/predictor.type";

export const benchmarkSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    userId: z.string().optional(),
    type: z.nativeEnum(PredictorType),
    value: z.number(),
});

export type Benchmark = z.infer<typeof benchmarkSchema>;

export function toPojo(val: Benchmark[]): Benchmark[] {
    return val.map((el) => {
        return {
            id: el.id,
            name: el.name,
            userId: el.userId,
            type: el.type,
            value: el.value,
        };
    });
}

export async function getAllBenchmarks(pb: PocketBase, userId: string): Promise<Safe<Benchmark[]>> {
    const benchmarks = await safe(
        pb
            .collection("benchmarks")
            .getFullList<Benchmark>({ filter: `userId = "${userId}" || userId = ""` }),
    );
    if (!benchmarks.success) return { error: benchmarks.error, success: false };
    return { data: toPojo(benchmarks.data), success: true };
}

export async function createOrUpdatePresonalBenchmark(
    pb: PocketBase,
    userId: string,
    type: PredictorType,
    value: number,
): Promise<Safe<Benchmark>> {
    const personal = await safe(
        pb
            .collection("benchmarks")
            .getFirstListItem<Benchmark>(`userId = "${userId}" && type = "${type}"`),
    );
    let res: Safe<Benchmark>;
    if (personal.success) {
        res = await safe(
            pb.collection("benchmarks").update<Benchmark>(personal.data.id, {
                name: "Personal",
                userId,
                type,
                value,
            }),
        );
    } else {
        res = await safe(
            pb.collection("benchmarks").create<Benchmark>({
                name: "Personal",
                userId,
                type,
                value,
            }),
        );
    }
    if (!res.success) return { error: res.error, success: false };
    return { data: res.data, success: true };
}
