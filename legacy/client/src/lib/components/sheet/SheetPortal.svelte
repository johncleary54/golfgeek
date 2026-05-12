<script lang="ts">
    import { Dialog as SheetPrimitive } from "radix-svelte";

    let className: string | undefined = undefined;
    export { className as class };
    export let position: "right" | "left" | "top" | "bottom" = "right";
</script>

<SheetPrimitive.Portal class={className} {...$$restProps}>
    <div
        class={position === "top"
            ? "items-start"
            : position === "bottom"
            ? "items-end"
            : position === "left"
            ? "justify-start"
            : "justify-end"}
    >
        <slot />
    </div>
</SheetPrimitive.Portal>
