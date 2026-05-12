<script lang="ts">
    import Combobox from "$lib/components/form/Combobox.svelte";
    import { selectedFilters } from "./filterService";
    import { Precipitations, Temperatures, Winds } from "./filtersType";
</script>

<Combobox
    label="Temperature"
    placeholder="Select temperature"
    value={$selectedFilters.temperature}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(Temperatures) as temperature}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        temperature: temperature,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {temperature}
            </button>
        {/each}
    </div>
</Combobox>

<Combobox label="Wind" placeholder="Select wind" value={$selectedFilters.wind} errors={[]}>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(Winds) as wind}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        wind: wind,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {wind}
            </button>
        {/each}
    </div>
</Combobox>

<Combobox
    label="Precipitation"
    placeholder="Select precipitation"
    value={$selectedFilters.precipitation}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(Precipitations) as precipitation}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        precipitation: precipitation,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {precipitation}
            </button>
        {/each}
    </div>
</Combobox>
