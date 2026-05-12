<script lang="ts">
    import InfoIcon from "$lib/icons/InfoIcon.svelte";
    import { Tooltip } from "radix-svelte";
    import TooltipContent from "$lib/components/TooltipContent.svelte";
    import { createSlider, melt } from "@melt-ui/svelte";
    import type { Writable } from "svelte/store";

    export let title = "";
    export let tooltip = "";
    export let sliderValue: Writable<number[]>;
    export let unit = "%";
    export let maxRange = 100;

    export let benchmark = 0;
    // $: if ($sliderValue[0] && $sliderValue[0] > maxRange) {
    //     sliderValue.set([maxRange]);
    // } else if ($sliderValue[0] && $sliderValue[0] < 0) {
    //     sliderValue.set([0]);
    // }

    const {
        elements: { root, range, thumb },
    } = createSlider({
        defaultValue: [30],
        step: 0.1,
        value: sliderValue,
        max: maxRange,
    });
</script>

<h5 class="flex items-center gap-2 text-sm font-medium text-neutral-900">
    {title}
    <Tooltip.Provider>
        <Tooltip.Root>
            <Tooltip.Trigger>
                <div class="text-neutral-400">
                    <div class="sr-only">Info</div>
                    <InfoIcon />
                </div>
            </Tooltip.Trigger>
            <TooltipContent class="max-w-[250px]">
                {tooltip}
            </TooltipContent>
        </Tooltip.Root>
    </Tooltip.Provider>
</h5>

<div class="flex items-center gap-2">
    <div class="relative grid w-full grid-cols-[50px_1fr_50px] items-center gap-2">
        <p class="text-sm text-neutral-600">0{unit}</p>

        <span use:melt={$root} class="relative flex h-[20px] w-full items-center">
            <span class="block h-[3px] w-full bg-black/10">
                <span use:melt={$range} class="bg-primary-500 h-[3px]" />
                {#if benchmark}
                    <span
                        class="border-1 border-primary-500 bg-primary-800 absolute z-10 h-3 w-3 -translate-x-1/2 rounded-full border"
                        style="left: {(benchmark / maxRange) *
                            100}%; top: 50%; transform: translateX(-50%) translateY(-50%);"
                    />
                {/if}
            </span>
            <span
                use:melt={$thumb()}
                class="bg-primary-500 block h-5 w-5 rounded-full focus:ring-4 focus:ring-black/40"
            />
        </span>
        <p class="text-right text-sm text-neutral-600">{maxRange}{unit}</p>
    </div>
    <input
        type="text"
        class="focus:ring-primary-500 w-24 rounded-lg border border-neutral-100 px-3 py-2 text-center text-sm text-neutral-900 focus:outline-none focus:ring-1"
        value={$sliderValue}
        on:input={(e) => {
            const value = Number(e.currentTarget.value);
            if (value >= 0 && value <= maxRange) {
                sliderValue.set([value]);
            }
        }}
    />
</div>
