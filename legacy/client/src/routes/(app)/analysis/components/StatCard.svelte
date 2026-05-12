<script lang="ts">
    import InfoTooltip from "$lib/components/InfoTooltip.svelte";
    import StatCardImage from "$lib/icons/StatCardImage.svelte";
    import { addPlusSign } from "$lib/utils";

    export let title: string;
    export let tooltip: string;
    export let stat: number;
    export let change: number;
    export let pgaTour: string;
    export let roundInfo: string;
    export let showImage = false;
    export let percent = false;
    export let reverseColors = false;
</script>

<div
    class="relative flex flex-1 flex-col gap-4 overflow-hidden rounded-lg border border-secondary-600 bg-secondary-600 p-6 shadow-card"
>
    {#if showImage}
        <div class="absolute right-0 top-0 z-0">
            <StatCardImage />
        </div>
    {/if}
    <div>
        <div class="flex items-center gap-2">
            <p class="text-sm font-medium uppercase text-white">{title}</p>
            <InfoTooltip {tooltip} />
        </div>
    </div>

    <div class="flex items-center justify-between">
        <div class="flex flex-1 flex-col gap-4">
            <div class="flex items-center justify-between">
                <p class="text-5xl text-white">{stat}{percent ? "%" : ""}</p>

                <div
                    class="rounded px-1.5 py-[2px] text-sm font-medium text-white
                       {reverseColors
                        ? (Number(change) > 0 ? 'bg-error-700 ' : '') +
                          (Number(change) < 0 ? 'bg-success-800 ' : '') +
                          (Number(change) === 0 ? 'bg-neutral-800 ' : '')
                        : (Number(change) < 0 ? 'bg-error-700 ' : '') +
                          (Number(change) > 0 ? 'bg-success-800 ' : '') +
                          (Number(change) === 0 ? 'bg-neutral-800 ' : '')}"
                >
                    {addPlusSign(Number(change.toFixed(2)))}{percent ? "%" : ""}
                </div>
            </div>
            <div class="flex items-center justify-between">
                <p class="text-sm text-white">{roundInfo}</p>
                <div class="rounded px-2 py-[2px] text-sm text-white">
                    {pgaTour}
                </div>
            </div>
        </div>
    </div>
</div>
