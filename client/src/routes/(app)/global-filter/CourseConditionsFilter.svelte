<script lang="ts">
    import Combobox from "$lib/components/form/Combobox.svelte";
    import { selectedFilters } from "./filterService";
    import { Firmness, Height, Smoothness, Speed } from "./filtersType";
</script>

<Combobox
    label="Green Speed"
    placeholder="Select green speed"
    value={$selectedFilters.speed}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(Speed) as speed}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        speed: speed,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {speed}
            </button>
        {/each}
    </div>
</Combobox>

<Combobox
    label="Green Smoothness"
    placeholder="Select green smoothness"
    value={$selectedFilters.smoothness}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(Smoothness) as smoothness}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        smoothness: smoothness,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {smoothness}
            </button>
        {/each}
    </div>
</Combobox>

<Combobox
    label="Rough Height"
    placeholder="Select rough height"
    value={$selectedFilters.height}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(Height) as height}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        height: height,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {height}
            </button>
        {/each}
    </div>
</Combobox>

<Combobox
    label="Course Firmness"
    placeholder="Select course firmness"
    value={$selectedFilters.firmness}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#each Object.values(Firmness) as firmness}
            <button
                type="button"
                on:click={() =>
                    selectedFilters.update((filters) => ({
                        ...filters,
                        firmness: firmness,
                    }))}
                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
            >
                {firmness}
            </button>
        {/each}
    </div>
</Combobox>
