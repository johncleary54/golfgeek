<script lang="ts">
    export let max = 100;
    export let current = 0;
    export let suffix = "";

    $: if (current > max) {
        current = max;
    }

    $: if (current < 0) {
        current = 0;
    }
</script>

<div class="bg-neutral-75 h-10 overflow-hidden rounded">
    <div
        class="bg-primary-500 relative h-full rounded transition-all duration-300 ease-in-out"
        style="width: {(current / max) * 100}%; max-width: 100%"
    >
        {#if (current / max) * 100 > 10}
            <div
                class="absolute bottom-0 right-0 top-0 flex items-center overflow-auto whitespace-nowrap px-2 text-sm text-white"
            >
                {current}{" "}{suffix}
            </div>
        {:else}
            <div
                class="absolute bottom-0 right-0 top-0 transform translate-x-full flex items-center overflow-auto whitespace-nowrap px-2 text-sm text-primary-500"
            >
                {current}{" "}{suffix}
            </div>
        {/if}
    </div>
</div>
