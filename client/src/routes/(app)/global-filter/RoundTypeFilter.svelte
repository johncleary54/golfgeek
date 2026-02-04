<script lang="ts">
    import Combobox from "$lib/components/form/Combobox.svelte";
    import { selectedFilters } from "./filterService";
    import { RoundTypes } from "./filtersType";
</script>

<Combobox label="Round Type" placeholder="Select round type" value={$selectedFilters.roundType}>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(RoundTypes) as type}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        roundType: type,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {type}
            </button>
        {/each}
    </div>
</Combobox>
