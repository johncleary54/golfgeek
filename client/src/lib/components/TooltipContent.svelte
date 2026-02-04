<script lang="ts">
    import type { TooltipContentProps } from "radix-svelte";
    import { Tooltip as TooltipPrimitive } from "radix-svelte";

    let className: string | undefined | null = undefined;
    export { className as class };
    export let sideOffset: TooltipContentProps["sideOffset"] = 4;
</script>

<TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
        {sideOffset}
        class="z-50 overflow-hidden rounded-md bg-neutral-950/90 px-3 py-1.5 text-sm text-neutral-50 shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 {className}"
        {...$$restProps}
    >
        <slot />
    </TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
