<script lang="ts">
    import type { AccordionItemProps } from "radix-svelte";
    import { Accordion as AccordionPrimitive } from "radix-svelte";
    let className: string | undefined = undefined;
    export { className as class };
    export let value: AccordionItemProps["value"];
</script>

<AccordionPrimitive.Item {value} class="border-b {className}" {...$$restProps}>
    <slot />
</AccordionPrimitive.Item>
