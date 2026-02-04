<script lang="ts">
    import { Accordion as AccordionPrimitive } from "radix-svelte";
    import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";

    let className: string | undefined = undefined;
    export { className as class };
</script>

<AccordionPrimitive.Header class="flex">
    <AccordionPrimitive.Trigger
        class="flex flex-1 items-center justify-between py-4 font-medium transition-all [&[data-state=open]>.svg]:rotate-90 {className}"
        {...$$restProps}
    >
        <slot />
        <div class="svg h-4 w-4 transition-transform duration-200">
            <ArrowRightIcon />
        </div>
    </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
