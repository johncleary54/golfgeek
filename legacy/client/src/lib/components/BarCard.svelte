<script lang="ts">
    import StrokesGainedBar from "$lib/components/StrokesGainedBar.svelte";
    import InfoTooltip from "./InfoTooltip.svelte";

    type BarData = {
        label: string;
        tooltip: string;
        value: number;
        border: boolean;
        origin?: number;
    };
    export let switchColors = false;
    export let title = "Strokes gained";
    export let subtitle = "";
    export let barData: BarData[] = [];
</script>

<div class="shadow-component flex h-min flex-col rounded-lg border border-neutral-100 bg-white">
    <header class="border-b border-neutral-100 px-6 py-4">
        <h1 class="text-xl font-medium">{title}</h1>
        <p class="text-sm text-neutral-600">{subtitle}</p>
    </header>

    <div class="px-6 pb-6 pt-4">
        {#each barData as item}
            <div
                class="flex items-center justify-between pb-2 first:mt-0"
                class:mt-6={!item.border}
            >
                <h5
                    class="flex items-center justify-center gap-1 text-sm font-normal text-neutral-600"
                >
                    {item.label}
                    <InfoTooltip tooltip={item.tooltip} />
                </h5>
                <h5 class="text-sm text-neutral-900">{item.value}</h5>
            </div>
            <StrokesGainedBar strokesGained={item.value} {switchColors} origin={item.origin} />

            {#if item.border}
                <hr class="my-6 border-neutral-100" />
            {/if}
        {/each}
    </div>
</div>
