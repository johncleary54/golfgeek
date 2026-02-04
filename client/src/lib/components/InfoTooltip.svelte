<script lang="ts">
    import InfoIcon from "$lib/icons/InfoIcon.svelte";
    import { createTooltip, melt } from "@melt-ui/svelte";
    import { fade } from "svelte/transition";

    export let tooltip: string;

    const {
        elements: { trigger, content },
        states: { open },
    } = createTooltip({
        positioning: {
            placement: "top",
        },
        openDelay: 300,
        closeOnPointerDown: false,
        forceVisible: true,
    });
</script>

<div class="sr-only">Info</div>
<div class="z-[5] text-neutral-200" use:melt={$trigger}>
    <InfoIcon />
</div>
{#if $open}
    <div
        use:melt={$content}
        transition:fade={{ duration: 100 }}
        class="z-50 overflow-hidden rounded-md bg-neutral-950/90 px-3 py-1.5 text-sm text-neutral-50 shadow-md"
    >
        {tooltip}
    </div>
{/if}
