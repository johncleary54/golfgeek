<script lang="ts">
    import { enhance } from "$app/forms";
    import ButtonIcon from "$lib/components/form/ButtonIcon.svelte";
    import { btn } from "$lib/components/form/button";
    import { toast } from "$lib/components/toast/toast";
    import TargetIcon from "$lib/icons/TargetIcon.svelte";
    import { createDialog, createRadioGroup, melt } from "@melt-ui/svelte";
    import { fade } from "svelte/transition";
    import type { PredictorType } from "../predictor.type";

    export let golfers: string[];
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

    const filteredPredictors = predictors.filter((el) => el.type === type1);
    const activeGolfer = benchmarks.find(
        (el) => el.id === filteredPredictors[0]?.benchmarkId,
    )?.name;

    const {
        elements: { root, item },
        helpers: { isChecked },
        states: { value },
    } = createRadioGroup({
        defaultValue: activeGolfer ?? "",
    });

    const {
        elements: { trigger, overlay, content, close, portalled },
        states: { open },
    } = createDialog();
</script>

<button class={btn.secondary} use:melt={$trigger}>
    <ButtonIcon>
        <TargetIcon />
    </ButtonIcon>
    Benchmarks
</button>
<div use:melt={$portalled}>
    {#if $open}
        <div use:melt={$overlay} class="fixed inset-0 z-40 bg-black/50" />
        <div
            class="fixed left-[50%] top-[50%] z-50 min-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6 shadow-lg"
            use:melt={$content}
            transition:fade={{ duration: 150 }}
        >
            <h1 class="text-2xl font-medium">Benchmarks</h1>
            <div class="space-y-4" use:melt={$root}>
                {#if golfers.includes("Personal")}
                    <div class="space-y-3">
                        <h2 class="text-sm font-medium text-neutral-600">Your Goal</h2>
                        <label
                            for="Personal"
                            id="Personal-label"
                            class="flex cursor-pointer items-center space-x-3 rounded-lg border border-neutral-100 p-2 shadow-component
                            {$isChecked('Personal') ? 'border-primary-600 shadow-step' : ''}"
                        >
                            <div class="flex items-center gap-3">
                                <button
                                    use:melt={$item("Personal")}
                                    class="hover:bg-magnum-100 grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow"
                                    id="Personal"
                                    aria-labelledby="Personal-label"
                                >
                                    {#if $isChecked("Personal")}
                                        <div class="h-3 w-3 rounded-full bg-blue-500" />
                                    {/if}
                                </button>
                            </div>
                            <div class="flex flex-col">Personal</div>
                        </label>
                    </div>
                {/if}
                <div class="space-y-3">
                    <h2 class="text-sm font-medium text-neutral-600">Players</h2>
                    {#each golfers.filter((el) => el != "Personal") as golfer}
                        <label
                            for={golfer}
                            id="{golfer}-label"
                            class="flex cursor-pointer items-center space-x-3 rounded-lg border border-neutral-100 p-2 shadow-component {$isChecked(
                                golfer,
                            )
                                ? 'border-primary-600 shadow-step'
                                : ''}"
                        >
                            <div class="flex items-center gap-3">
                                <button
                                    use:melt={$item(golfer)}
                                    class="hover:bg-magnum-100 grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow"
                                    id={golfer}
                                    aria-labelledby="{golfer}-label"
                                >
                                    {#if $isChecked(golfer)}
                                        <div class="h-3 w-3 rounded-full bg-blue-500" />
                                    {/if}
                                </button>
                            </div>
                            <div class="flex flex-col">
                                {golfer}
                            </div>
                        </label>
                    {/each}
                </div>
            </div>
            <div class="mt-4 flex flex-row justify-between">
                <div class="flex flex-row gap-2">
                    <button class={btn.secondary} use:melt={$close}>Close Dialog</button>
                    <form
                        action="?/clearPredictors"
                        method="post"
                        use:enhance={() => {
                            loading = true;
                            return async ({ result, update }) => {
                                await update({ reset: false });
                                if (result.type === "success") {
                                    toast({
                                        message: "Predictors cleared",
                                        type: "success",
                                    });
                                }
                                open.set(false);
                                loading = false;
                            };
                        }}
                    >
                        <input type="hidden" name="type1" value={type1 ?? ""} />
                        <input type="hidden" name="type2" value={type2 ?? ""} />
                        <input type="hidden" name="type3" value={type3 ?? ""} />
                        <input type="hidden" name="type4" value={type4 ?? ""} />
                        <button class={btn.error}>Clear</button>
                    </form>
                </div>
                <form
                    action="?/updatePredictors"
                    method="post"
                    use:enhance={() => {
                        loading = true;
                        return async ({ result, update }) => {
                            await update({ reset: false });
                            if (result.type === "success") {
                                toast({
                                    message: "Predictors updated",
                                    type: "success",
                                });
                            }
                            open.set(false);
                            loading = false;
                        };
                    }}
                >
                    <input type="hidden" name="name" value={$value} />
                    <input type="hidden" name="value1" value={value1 ?? 0} />
                    <input type="hidden" name="type1" value={type1 ?? ""} />
                    <input type="hidden" name="value2" value={value2 ?? 0} />
                    <input type="hidden" name="type2" value={type2 ?? ""} />
                    <input type="hidden" name="value3" value={value3 ?? 0} />
                    <input type="hidden" name="type3" value={type3 ?? ""} />
                    <input type="hidden" name="value4" value={value4 ?? 0} />
                    <input type="hidden" name="type4" value={type4 ?? ""} />
                    <button class={btn.primary}>
                        <ButtonIcon {loading} />
                        Save
                    </button>
                </form>
            </div>
        </div>
    {/if}
</div>
