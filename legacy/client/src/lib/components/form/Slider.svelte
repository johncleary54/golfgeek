<script lang="ts">
    import type { SliderRootProps } from "radix-svelte";
    import { Slider as SliderPrimitive } from "radix-svelte";

    let className: string | undefined | null = undefined;
    export { className as class };
    export let value: SliderRootProps["value"] = 0;
</script>

<SliderPrimitive.Root
    bind:value
    class="relative flex w-full touch-none select-none items-center {className}"
    {...$$restProps}
>
    <SliderPrimitive.Track
        class="relative h-[2px] w-full grow overflow-hidden rounded-full bg-neutral-100"
    >
        <SliderPrimitive.Range class="absolute h-full bg-primary-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
        class="ring-offset-background focus-visible:ring-ring block h-5 w-5 cursor-pointer rounded-full border-2 border-primary-500 bg-primary-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    />
</SliderPrimitive.Root>
