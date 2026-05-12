<script lang="ts">
    import Combobox from "$lib/components/form/Combobox.svelte";
    import { selectedFilters } from "./filterService";
    import { GolfScores } from "./filtersType";
</script>

<Combobox
    label="Round Score"
    placeholder="Select round score"
    value={$selectedFilters.score}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(GolfScores) as score}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        score: score,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {score}
            </button>
        {/each}
    </div>
</Combobox>
