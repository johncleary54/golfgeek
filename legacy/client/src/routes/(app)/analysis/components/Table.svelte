<script lang="ts">
    import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
    import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
    import { usePagination } from "$lib/hooks/usePagination";
    import type { OTTShotClub } from "$lib/server/calculator/ClubOTTCalculator";

    export let tableData: Record<string, string | number | OTTShotClub>[] = [];

    export let tableColumns: string[] = [];

    const { pagination, onNextPage, onPrevPage, goToPage, calcPageCount, currentPageData } =
        usePagination<Record<string, string | number | OTTShotClub>>(tableData, 10);

    calcPageCount(tableData.length);
</script>

<div class="shadow-component mt-6 border-collapse rounded-lg border border-neutral-100 bg-white">
    <div class="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <h4 class="text-xl font-medium">Breakdown</h4>
    </div>
    <div class=" shadow-t-none overflow-auto rounded-b-lg">
        <table class="w-full">
            <thead>
                <tr class="text-xs text-neutral-600">
                    {#each tableColumns as val}
                        <th class=" border-r border-neutral-100 px-3 py-2.5 last:border-r-0">
                            {val}
                        </th>
                    {/each}
                </tr>
            </thead>

            <tbody>
                {#if currentPageData(tableData, $pagination.currentPage).length > 0}
                    {#each currentPageData(tableData, $pagination.currentPage) as data}
                        <tr
                            class="[&:nth-child(9)]:bg-error-50 border-t border-neutral-100 text-sm [&:nth-child(odd)]:bg-[#F8F8F8]"
                        >
                            {#each Object.values(data) as val}
                                <td class="border-r border-neutral-100 px-3 py-2.5 last:border-r-0">
                                    {val}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                {:else}
                    <tr class="border-t border-neutral-100">
                        <td
                            class="px-4 py-6 text-center text-lg font-medium text-neutral-600"
                            colspan="12"
                        >
                            No data available
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

{#if tableData.length > 10}
    <div class="flex items-center justify-end gap-2 py-4">
        <button
            on:click={onPrevPage}
            id="prevPageBtn"
            class="shadow-component flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 bg-white text-sm font-medium text-neutral-900 transition-colors duration-300 ease-in-out hover:bg-neutral-50"
            disabled={$pagination.currentPage === 1}
        >
            <ArrowLeftIcon />
        </button>
        {#each Array.from({ length: $pagination.pageCount }, (_, i) => i + 1) as page}
            <button
                on:click={() => goToPage(page)}
                class="shadow-component h-8 w-8 rounded-lg border border-neutral-100 bg-white text-sm font-medium text-neutral-900 transition-colors duration-300 ease-in-out hover:bg-neutral-50"
                class:border-neutral-900={$pagination.currentPage === page}
            >
                {page}
            </button>
        {/each}
        <button
            on:click={onNextPage}
            id="nextPageBtn"
            class="shadow-component flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 bg-white text-sm font-medium text-neutral-900 transition-colors duration-300 ease-in-out hover:bg-neutral-50"
            disabled={$pagination.currentPage === $pagination.pageCount}
        >
            <ArrowRightIcon />
        </button>
    </div>
{:else}
    <span />
{/if}
