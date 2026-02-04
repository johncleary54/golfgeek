<script lang="ts">
    import Loader from "$lib/components/Loader.svelte";

    export let type: "button" | "submit" = "submit";
    export let loading = false;
    export let disabled = false;
    export let variant: "primary" | "secondary" | "error" | "ghost" = "primary";
    export let form: string | undefined = undefined;
    export let iconPosition: "left" | "right" = "right";
    export let size: "sm" | "md" | "lg" = "md";
    export let href: string | undefined = undefined;
    let className: string | undefined = undefined;
    export { className as class };
</script>

<svelte:element
    this={href ? "a" : "button"}
    {href}
    {form}
    on:click
    {type}
    disabled={loading || disabled}
    class="flex flex-row items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-lg px-4 py-2.5 font-medium shadow-component transition focus:ring-1 disabled:opacity-50
        {variant === 'secondary'
        ? ' border border-neutral-100 bg-white hover:bg-neutral-50 focus:ring-primary-300'
        : variant === 'error'
        ? ' bg-error-600'
        : variant === 'ghost'
        ? ' border border-transparent bg-transparent shadow-none focus:ring-primary-300'
        : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-secondary-300'}
        {size === 'sm' ? ' text-sm' : size === 'lg' ? ' text-lg' : 'text-base'}
        {className ? ' ' + className : ''}"
>
    {#if iconPosition === "left"}
        {#if $$slots.icon}
            <div class="flex h-6 w-6 items-center justify-center">
                <slot name="icon" />
            </div>
        {:else if loading}
            <div class="flex h-4 w-4 items-center justify-center">
                <Loader size={size === "sm" ? 16 : 18} />
            </div>
        {/if}
    {/if}
    <slot />
    {#if iconPosition === "right"}
        {#if $$slots.icon}
            <div class="flex h-6 w-6 items-center justify-center">
                <slot name="icon" />
            </div>
        {:else if loading}
            <div class="flex h-4 w-4 items-center justify-center">
                <Loader size={size === "sm" ? 16 : 18} />
            </div>
        {/if}
    {/if}
</svelte:element>
