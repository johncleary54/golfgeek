<script lang="ts">
    import ProgressBar from "$lib/components/ProgressBar.svelte";
    import InfoTooltip from "$lib/components/InfoTooltip.svelte";

    export let barData: {
        title: string;
        max: number;
        current: number;
        suffix: string;
        goal: string;
        tooltip: string;
    }[] = [];
</script>

{#each barData as data}
    <div class="items-end justify-center gap-2 sm:flex">
        <div class="mb-3 flex flex-1 flex-col sm:mb-0">
            <div class="items-center justify-between pb-2 sm:flex">
                <h5
                    class="flex items-center gap-2 text-sm font-normal text-neutral-900 sm:justify-between"
                >
                    {data.title}
                    <InfoTooltip tooltip={data.tooltip} />
                </h5>
                <h5 class="text-sm text-neutral-900">
                    {#if data.goal}
                        <span class="text-neutral-600">Goal:</span>
                        {data.goal + data.suffix}
                    {/if}
                </h5>
            </div>

            <ProgressBar max={data.max} current={data.current} suffix={data.suffix} />
        </div>
        <hr class="border-neutral-100 sm:hidden" />
    </div>
{/each}
