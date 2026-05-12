<script lang="ts">
    import { enhance } from "$app/forms";
    import Button from "$lib/components/form/Button.svelte";
    import { toast } from "$lib/components/toast/toast";
    import PlusCircleIcon from "$lib/icons/PlusCircleIcon.svelte";
    import type { ActionData, PageData } from "./$types.js";
    import RoundsTable from "./RoundsTable.svelte";

    export let data: PageData;
    export let form: ActionData;

    let searchQuery = "";
    $: filteredData = data.rounds;

    $: if (form?.error) {
        toast({
            message: form.error,
            type: "error",
        });
    }
</script>

<div class="relative mx-auto max-w-screen-2xl px-6 py-6">
    <h1 class="max-w-4xl pb-8 text-2xl font-medium text-neutral-600">
        You have played <span class="text-primary-600">
            {data.roundsPlayedThisMonth.length || 0} rounds this month
        </span>
        and your best score was
        <span class="text-primary-600">{data.bestScoreThisMonth || 0}</span>
    </h1>

    <div class="flex justify-between gap-2">
        <input
            type="search"
            placeholder="Search..."
            class="h-11 w-full rounded-lg border border-neutral-100 bg-white px-4 py-2 text-sm shadow placeholder:text-sm focus:ring-1 focus:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50 md:w-[300px]"
            name="search"
            bind:value={searchQuery}
            on:input={() => {
                filteredData = data.rounds.filter((round) => {
                    const courseMatch = round.courseName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());

                    const dateMatch = round.date.toLowerCase().includes(searchQuery.toLowerCase());

                    return courseMatch || dateMatch;
                });
            }}
        />
        <form action="?/newRound" method="post" use:enhance>
            <Button variant="primary" size="sm">
                <svelte:fragment slot="icon">
                    <PlusCircleIcon />
                </svelte:fragment>
                Add round
            </Button>
        </form>
    </div>

    <RoundsTable tableData={filteredData} />
</div>
