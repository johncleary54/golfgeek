<script lang="ts">
    export let activeTab: string | undefined;
    export let tabOptions: string[];
    export let size: "full" | "fit" = "fit";

    function setActiveTab(tab: string): void {
        activeTab = tab;
    }
</script>

<div
    class="flex gap-1 rounded-lg bg-neutral-75 p-1 text-sm text-neutral-600
  {size === 'full' ? 'w-full' : 'w-fit'}"
>
    {#each tabOptions as tabOption}
        <button
            on:click={() => setActiveTab(tabOption)}
            class="flex cursor-pointer justify-center whitespace-nowrap rounded-lg px-3 py-2.5 align-middle text-sm font-medium transition-colors duration-300 ease-in-out hover:bg-white
            {size === 'full' ? 'w-full' : ''}
            {activeTab === tabOption ? 'bg-white' : 'bg-neutral-75'}"
        >
            {tabOption.charAt(0).toUpperCase() + tabOption.slice(1)}
        </button>
    {/each}
</div>
