<script lang="ts">
    import StrokesGainedBar from "$lib/components/StrokesGainedBar.svelte";
    import { createRadioGroup, melt } from "@melt-ui/svelte";
    import DataTabs from "./DataTabs.svelte";
    import type { ApproachType } from "$lib/types";
    import type { Writable } from "svelte/store";
    import { formatSingleWordOrCamelCase } from "$lib/utils";

    type BarData = {
        id: number;
        label: string;
        value: number;
        shotsPerRound?: number;
    };

    export let title = "Strokes gained";
    export let subtitle = "";
    // TODO: Switch all to approach type and remove [string, string]
    export let tabOptions: [] | [string, string] | ApproachType[] = [];
    export let tabData: BarData[] = [];
    export let activeTab: string;

    export let selected: Writable<string>;

    // This is for switching tabs in analysis - putting - kpi
    $: {
        if (tabData[0]?.id !== previousTabData[0]?.id) {
            previousTabData = tabData;
            selected.set(tabData[0]?.label ?? "");
        }
    }
    let previousTabData = tabData;

    const {
        elements: { root, item },
        helpers: { isChecked },
    } = createRadioGroup({
        value: selected,
        defaultValue: tabData[0]?.label,
    });
</script>

<div class="shadow-card flex h-min flex-col rounded-lg border border-neutral-100 bg-white">
    <div class="border-b border-neutral-100 px-6 py-4">
        <h4 class="text-xl font-medium">{title}</h4>
        <p class="text-sm text-neutral-600">{subtitle}</p>
    </div>
    {#if tabOptions.length}
        <div class="px-6 py-6">
            <div class="mb-6 flex">
                <DataTabs {tabOptions} size="full" bind:activeTab />
            </div>
            <div use:melt={$root} class="flex flex-col space-y-2">
                {#each tabData as option}
                    <label
                        for={option.label}
                        id="{option.label}-label"
                        class="hover:bg-primary-50 cursor-pointer rounded-lg border border-neutral-100 p-4 transition-colors duration-300 ease-in-out {$isChecked(
                            option.label,
                        )
                            ? 'border-primary-600 shadow-step'
                            : ''}"
                    >
                        <button
                            use:melt={$item(option.label)}
                            id={option.label}
                            class="sr-only"
                            aria-labelledby="{option.label}-label"
                        />
                        <div class="options-center flex justify-between pb-2">
                            <h5
                                class="options-center flex font-normal text-neutral-900 sm:justify-between"
                            >
                                {formatSingleWordOrCamelCase(option.label)}
                            </h5>
                            <h5 class="text-sm text-neutral-900">
                                {option.value}
                            </h5>
                        </div>

                        <div class="flex items-center justify-center gap-2">
                            <StrokesGainedBar strokesGained={option.value} />
                        </div>

                        <div class="pt-2 text-sm font-normal text-neutral-600">
                            {option.shotsPerRound
                                ? `${option.shotsPerRound.toFixed(2)} ${
                                      option.shotsPerRound === 1 ? "shot" : "shots"
                                  } per round`
                                : "0.00 shots per round"}
                        </div>
                    </label>
                {/each}
            </div>
        </div>
    {/if}
</div>
