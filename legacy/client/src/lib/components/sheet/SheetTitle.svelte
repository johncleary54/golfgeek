<script lang="ts">
    import { Dialog as SheetPrimitive } from "radix-svelte";

    let className: string | undefined = undefined;
    export { className as class };
</script>

<SheetPrimitive.Title class="text-xl font-medium text-neutral-900 {className}" {...$$restProps}>
    <slot />
</SheetPrimitive.Title>
