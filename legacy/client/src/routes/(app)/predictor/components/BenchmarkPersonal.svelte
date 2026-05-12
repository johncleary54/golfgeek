<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { btn } from "$lib/components/form/button";
    import { toast } from "$lib/components/toast/toast";
    import type { PredictorType } from "../predictor.type";

    export let predictors: { type: PredictorType; benchmarkId?: string }[];
    export let benchmarks: { id: string; name?: string }[];
    export let value1: number[] | undefined;
    export let type1: PredictorType | undefined;
    export let value2: number[] | undefined;
    export let type2: PredictorType | undefined;
    export let value3: number[] | undefined;
    export let type3: PredictorType | undefined;
    export let value4: number[] | undefined;
    export let type4: PredictorType | undefined;

    let loading = false;

    $: filteredPredictors = predictors.filter((el) => el.type === type1);
    $: activeGolfer = benchmarks.find((el) => el.id === filteredPredictors[0]?.benchmarkId)?.name;
    $: isPersonal = activeGolfer === "Personal";
</script>

<form
    action="?/createPersonal"
    method="post"
    use:enhance={() => {
        loading = true;
        return async ({ result, update }) => {
            await update({ reset: false });
            if (result.type === "success") {
                toast({
                    message: "Personal benchmark created",
                    type: "success",
                });
                await invalidateAll();
            }
            loading = false;
        };
    }}
>
    <input type="hidden" name="value1" bind:value={value1} />
    <input type="hidden" name="type1" bind:value={type1} />
    <input type="hidden" name="value2" bind:value={value2} />
    <input type="hidden" name="type2" bind:value={type2} />
    <input type="hidden" name="value3" bind:value={value3} />
    <input type="hidden" name="type3" bind:value={type3} />
    <input type="hidden" name="value4" bind:value={value4} />
    <input type="hidden" name="type4" bind:value={type4} />
    <input type="hidden" name="isPersonal" bind:value={isPersonal} />

    <button class="{btn.primary} w-full sm:w-auto" disabled={loading} type="submit">
        Save as goal
    </button>
</form>
