<script lang="ts">
    import { Dialog as SheetPrimitive } from "radix-svelte";

    let className: string | undefined = undefined;
    export { className as class };
</script>

<SheetPrimitive.Overlay
    class="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in {className}"
    {...$$restProps}
/>
