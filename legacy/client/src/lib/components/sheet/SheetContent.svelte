<script lang="ts">
    import { Dialog as SheetPrimitive } from "radix-svelte";

    import SheetOverlay from "./SheetOverlay.svelte";
    import SheetPortal from "./SheetPortal.svelte";
    import XIcon from "$lib/icons/XIcon.svelte";

    let className: string | undefined = undefined;
    export { className as class };
    export let position: "right" | "left" | "top" | "bottom" = "right";
    export let width: "content" | "default" | "sm" | "md" | "lg" | "full" = "default";

    export let height: "content" | "default" | "sm" | "md" | "lg" | "full" = "default";
</script>

<SheetPortal {position}>
    <SheetOverlay />
    <SheetPrimitive.Content
        class="fixed z-50 scale-100  border-neutral-100 bg-neutral-50 opacity-100 shadow-component
        {position === 'left'
            ? 'h-full border-r animate-in slide-in-from-left duration-300'
            : position === 'top'
            ? 'inset-0 w-full border-b animate-in slide-in-from-top duration-300'
            : position === 'bottom'
            ? 'w-full border-t animate-in slide-in-from-bottom duration-300'
            : 'right-0 top-0 h-full border-l animate-in slide-in-from-right duration-300'}
        {width === 'content'
            ? 'max-w-screen'
            : width === 'sm'
            ? 'w-1/4'
            : width === 'md'
            ? 'w-1/2'
            : width === 'lg'
            ? 'w-5/6'
            : width === 'full'
            ? 'w-screen'
            : 'w-1/3'}

        {height === 'content'
            ? 'max-h-screen'
            : height === 'sm'
            ? 'h-1/4'
            : height === 'md'
            ? 'h-1/2'
            : height === 'lg'
            ? 'h-5/6'
            : height === 'full'
            ? 'h-screen'
            : 'h-screen'}
        {className}"
        {...$$restProps}
    >
        <slot />
        <SheetPrimitive.Close
            class="absolute right-4 top-4 rounded-sm text-neutral-400 opacity-70 ring-offset-primary-300 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary-300"
        >
            <XIcon />

            <span class="sr-only">Close</span>
        </SheetPrimitive.Close>
    </SheetPrimitive.Content>
</SheetPortal>
