<script lang="ts">
    import type { AccordionContentProps } from "radix-svelte";
    import { Accordion as AccordionPrimitive } from "radix-svelte";

    let className: string | undefined = undefined;
    export { className as class };
    export let transition: AccordionContentProps["transition"] = true;
</script>

<AccordionPrimitive.Content
    class="overflow-hidden text-sm {className}"
    {...$$restProps}
    {transition}
>
    <div class="pb-4 pt-0">
        <slot />
    </div>
</AccordionPrimitive.Content>
