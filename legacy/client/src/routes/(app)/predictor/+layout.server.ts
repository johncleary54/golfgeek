import { getAllPredictors } from "$lib/server/predictor/predictor.service";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getAllBenchmarks } from "$lib/server/predictor/benchmark.service";

export const load: LayoutServerLoad = async ({ locals }) => {
    const benchmarksP = getAllBenchmarks(locals.pb, locals.user.id);
    const predictorsP = getAllPredictors(locals.pb, locals.user.id);

    const [benchmarks, predictors] = await Promise.all([benchmarksP, predictorsP]);

    if (!predictors.success) {
        throw error(404, predictors.error);
    }
    if (!benchmarks.success) {
        throw error(404, benchmarks.error);
    }

    const golfers = new Set<string>();
    for (const benchmark of benchmarks.data) {
        golfers.add(benchmark.name ?? "Personal");
    }

    return {
        predictors: predictors.data,
        benchmarks: benchmarks.data,
        golfers: Array.from(golfers),
    };
};
