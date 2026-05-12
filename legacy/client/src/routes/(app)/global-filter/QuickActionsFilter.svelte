<script lang="ts">
    import Combobox from "$lib/components/form/Combobox.svelte";
    import { selectedFilters } from "./filterService";
    import { QuickActions } from "./filtersType";
</script>

<Combobox
    label="Quick Actions"
    placeholder="Select quick action"
    value={$selectedFilters.quickAction}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(QuickActions) as quickAction}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        quickAction: quickAction,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {quickAction}
            </button>
        {/each}
    </div>
</Combobox>
