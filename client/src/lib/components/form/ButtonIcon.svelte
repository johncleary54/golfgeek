<script lang="ts">
    import Loader from "$lib/components/Loader.svelte";

    export let loading = false;
    export let size: "sm" | "md" | "lg" = "md";
</script>

{#if loading}
    <div class="flex h-6 w-6 items-center justify-center">
        <Loader size={size === "sm" ? 16 : 18} />
    </div>
{:else if $$slots.default}
    <div class="flex h-6 w-6 items-center justify-center">
        <slot />
    </div>
{/if}
