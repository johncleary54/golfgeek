<script lang="ts">
    import TrashIcon from "$lib/icons/TrashIcon.svelte";
    import PencilIcon from "$lib/icons/PencilIcon.svelte";
    import HoleIcon from "$lib/icons/HoleIcon.svelte";
    import ModalConfirmation from "$lib/components/ModalConfirmation.svelte";
    import { usePagination } from "$lib/hooks/usePagination";
    import ArrowLeftIcon from "$lib/icons/ArrowLeftIcon.svelte";
    import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";

    type TableData = {
        id: string;
        courseName: string;
        score: number;
        date: string;
        holes: number;
        putt: number;
        arg: number;
        app: number;
        ott: number;
        total: number;
    };

    export let tableData: TableData[] = [];

    let open = false;
    let roundId = "";
    function onDeleteRound(id: string): void {
        open = true;
        roundId = id;
    }

    const { pagination, onNextPage, onPrevPage, goToPage, calcPageCount, currentPageData } =
        usePagination<TableData>(tableData, 10);

    calcPageCount(tableData.length);
</script>

{#if open}
    <ModalConfirmation
        action="deleteRound"
        args={{
            roundId,
        }}
        on:close={() => (open = false)}
    />
{/if}

<div class="mt-6 border-collapse rounded-lg border border-neutral-100 bg-white shadow-component">
    <div class="shadow-t-none overflow-auto rounded-b-lg">
        <table class="w-full">
            <thead>
                <tr class="text-left text-xs text-neutral-600">
                    {#each ["COURSE", "SCORE", "DATE", "HOLES", "PUTT", "ARG", "APP", "OTT", "TOTAL", "ACTIONS"] as val}
                        <th class=" border-r border-neutral-100 px-3 py-2.5 last:border-r-0">
                            {val}
                        </th>
                    {/each}
                </tr>
            </thead>

            <tbody>
                <tr />
                {#if currentPageData(tableData, $pagination.currentPage).length > 0}
                    {#each currentPageData(tableData, $pagination.currentPage) as round}
                        <tr
                            class="border-t border-neutral-100 text-sm [&:nth-child(9)]:bg-error-50 [&:nth-child(odd)]:bg-[#F8F8F8]"
                        >
                            {#each Object.entries(round) as [key, val]}
                                {#if key !== "id"}
                                    <td
                                        class="w-[1%] whitespace-nowrap border-r border-neutral-100 px-3 py-2.5 last:border-r-0"
                                    >
                                        {#if key === "holes"}
                                            <div class="flex gap-2 text-neutral-900">
                                                <HoleIcon />
                                                {val}
                                            </div>
                                        {:else if key === "date"}
                                            {val ? new Date(val).toDateString() : "-"}
                                        {:else if key === "putt" || key === "arg" || key === "app" || key === "ott" || key === "total"}
                                            <div
                                                class="relative grid min-w-[5rem] grid-cols-2 items-center"
                                            >
                                                {#if Number(val) > 0}
                                                    <div
                                                        class="w-full min-w-[2rem] pr-2 text-right"
                                                    >
                                                        {val}
                                                    </div>
                                                    <div
                                                        class="absolute left-1/2 z-10 h-full w-[1px] -translate-x-1/2 bg-neutral-100"
                                                    />
                                                    <div
                                                        class="flex w-full flex-1 items-center justify-start"
                                                    >
                                                        <div
                                                            class="h-4 max-w-full rounded-r bg-gradient-to-r from-success-200 to-success-500"
                                                            style={`width: ${Math.abs(
                                                                Number(val) * 50,
                                                            )}%
                                                     
                                                        `}
                                                        />
                                                    </div>
                                                {:else}
                                                    <div
                                                        class="flex w-full flex-1 items-center justify-end"
                                                    >
                                                        <div
                                                            class="h-4 max-w-full rounded-l bg-gradient-to-l from-error-200 to-error-500"
                                                            style={`width: ${Math.abs(
                                                                Number(val) * 50,
                                                            )}%
                                                            `}
                                                        />
                                                    </div>
                                                    <div
                                                        class="absolute left-1/2 z-10 h-full w-[1px] -translate-x-1/2 bg-neutral-100"
                                                    />
                                                    <div class="w-full pl-2 text-left">
                                                        {val}
                                                    </div>
                                                {/if}
                                            </div>
                                        {:else}
                                            {!val ? "-" : val}
                                        {/if}
                                    </td>
                                {/if}
                            {/each}
                            <td class="w-[0%]">
                                <div class="flex justify-center gap-2 text-neutral-600">
                                    <button
                                        class="cursor-pointer"
                                        on:click={() => onDeleteRound(round.id)}
                                    >
                                        <TrashIcon />
                                    </button>
                                    <a class="cursor-pointer" href="/rounds/{round.id}/step1">
                                        <PencilIcon />
                                    </a>
                                </div>
                            </td>
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
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 bg-white text-sm font-medium text-neutral-900 shadow-component transition-colors duration-300 ease-in-out hover:bg-neutral-50"
            disabled={$pagination.currentPage === 1}
        >
            <ArrowLeftIcon />
        </button>
        {#each Array.from({ length: $pagination.pageCount }, (_, i) => i + 1) as page}
            <button
                on:click={() => goToPage(page)}
                class="h-8 w-8 rounded-lg border border-neutral-100 bg-white text-sm font-medium text-neutral-900 shadow-component transition-colors duration-300 ease-in-out hover:bg-neutral-50"
                class:border-neutral-900={$pagination.currentPage === page}
            >
                {page}
            </button>
        {/each}
        <button
            on:click={onNextPage}
            id="nextPageBtn"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-100 bg-white text-sm font-medium text-neutral-900 shadow-component transition-colors duration-300 ease-in-out hover:bg-neutral-50"
            disabled={$pagination.currentPage === $pagination.pageCount}
        >
            <ArrowRightIcon />
        </button>
    </div>
{:else}
    <span />
{/if}
