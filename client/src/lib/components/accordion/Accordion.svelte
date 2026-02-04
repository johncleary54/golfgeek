<script lang="ts">
    import { Accordion as AccordionPrimitive } from "radix-svelte";
    import type { AccordionItemProps } from "radix-svelte";

    // TODO: Remove the any when radix-svelte is updated to properly satisfy the types
    // https://www.radix-svelte.com/docs/accordion
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // export let value: any = undefined;
    export let value: AccordionItemProps["value"] | undefined = undefined;
</script>

<AccordionPrimitive.Root bind:value {...$$restProps}>
    <slot />
</AccordionPrimitive.Root>
