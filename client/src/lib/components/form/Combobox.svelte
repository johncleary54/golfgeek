<script lang="ts">
    import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
    import Dropdown from "./Dropdown.svelte";

    export let label: string;
    export let placeholder: string;
    export let value: string;
    export let errors: string[] = [];
    export let above = false;
    export let disabled = false;
</script>

<div class="relative flex w-full flex-col">
    <label class="flex w-full flex-col gap-1 whitespace-nowrap text-left text-sm text-neutral-600">
        {label}
        <Dropdown full {above} {disabled}>
            <svelte:fragment slot="button">
                <div
                    class="flex h-12 w-full flex-row items-center justify-between rounded-lg border bg-white px-4 text-neutral-600 shadow {errors.length >
                    0
                        ? 'border-error-600'
                        : 'border-neutral-100'}"
                >
                    {#if value}
                        <span class="text-neutral-900">{value}</span>
                    {:else}
                        <span class="text-neutral-400">{placeholder}</span>
                    {/if}
                    <span class="rotate-90">
                        <ArrowRightIcon />
                    </span>
                </div>
            </svelte:fragment>
            <slot slot="dropdown" />
        </Dropdown>
    </label>
    <p class="h-6 pt-1 text-left text-sm text-error-600">
        {errors.join(", ")}
    </p>
</div>
