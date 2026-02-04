<script lang="ts">
    import type { HoverCardContentProps } from "radix-svelte";
    import { HoverCard } from "radix-svelte";

    let className: string | undefined = undefined;
    export { className as class };
    export let align: HoverCardContentProps["align"] = undefined;
    export let sideOffset: HoverCardContentProps["sideOffset"] = undefined;
</script>

<HoverCard.Portal>
    <HoverCard.Content
        {align}
        {sideOffset}
        class="z-50 mt-3 w-fit rounded-md border bg-white p-3 text-neutral-900 shadow-md outline-none animate-in fade-in-90 zoom-in-90 {className}"
        {...$$restProps}
    >
        <slot />
    </HoverCard.Content>
</HoverCard.Portal>
