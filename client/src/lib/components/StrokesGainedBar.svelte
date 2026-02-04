<script lang="ts">
    export let strokesGained = 0;
    export let origin = 0;
    $: fillPercentage = (Math.abs(strokesGained - origin) / 2) * 50;
    $: isPositive = strokesGained > origin;
    export let height = 3;
    export let switchColors = false;
</script>

<div
    class="flex items-center h-{height} bg-neutral-75 relative w-full overflow-hidden rounded-[2px]"
>
    <div class="absolute left-1/2 z-10 h-full w-[2px] -translate-x-1/2 bg-neutral-600" />

    <div
        class="absolute left-1/2 h-full origin-center transform transition-all duration-300 ease-in-out
    {isPositive
            ? switchColors
                ? 'right-fill from-error-500 to-error-200 rounded-l-[2px] bg-gradient-to-l'
                : 'right-fill from-success-500 to-success-200 rounded-r-[2px] bg-gradient-to-r'
            : switchColors
            ? 'left-fill from-success-500 to-success-200 -translate-x-full rounded-r-[2px] bg-gradient-to-r'
            : 'left-fill from-error-500 to-error-200 -translate-x-full rounded-l-[2px] bg-gradient-to-l'}"
        style="--fill-percentage: {fillPercentage}%;"
    />
</div>

<style>
    .left-fill {
        width: var(--fill-percentage, 0%);
    }

    .right-fill {
        width: var(--fill-percentage, 0%);
    }
</style>
