<script lang="ts">
    import ParTabs from "./ParTabs.svelte";
    import HoleIcon from "$lib/icons/HoleIcon.svelte";
    import PencilIcon from "$lib/icons/PencilIcon.svelte";
    import TrashIcon from "$lib/icons/TrashIcon.svelte";
    import { HoverCard } from "radix-svelte";
    import HoverCardContent from "$lib/components/HoverCardContent.svelte";
    import { getContext } from "svelte";
    import type { Context } from "./context";
    import ModalConfirmation from "$lib/components/ModalConfirmation.svelte";
    import { page } from "$app/stores";

    const { data, activeHole, shotForm, isEditing } = getContext<Context>("context");

    let tableData: {
        shot: number;
        location: string;
        distance: number;
        club: string;
        tags: string;
    }[] = [];

    $: currentShots = $data.shots.filter((shot) => shot.hole === $activeHole + 1);
    $: tableData = currentShots.map((shot, index) => ({
        shot: index + 1,
        location: shot.location,
        distance: shot.distance,
        club: shot.club,
        tags: shot.tags,
    }));

    function onEditShot(index: number): void {
        const shot = currentShots[index];
        if (!shot) return;
        shotForm.set({
            id: shot.id,
            shotNumber: String(index + 1),
            location: shot.location,
            distance: String(shot.distance),
            club: shot.club,
            tags: shot.tags,
        });
        isEditing.set(true);
    }

    let open = false;
    let id = "";
    let holeId = "";
    function onDeleteShot(index: number): void {
        const hole = $data.holes.find((h) => h.hole === $activeHole + 1);
        if (!hole) return;
        id = currentShots[index]?.id ?? "";
        holeId = hole.id;
        open = true;
    }
</script>

{#if open}
    <ModalConfirmation
        action="deleteShot"
        args={{
            id: id,
            roundId: $page.params.roundId ?? "",
            activeHole: String($activeHole + 1),
            holeId: holeId,
        }}
        on:close={() => (open = false)}
    />
{/if}

<div
    class="h-fit w-full overflow-auto rounded-lg border border-neutral-100 bg-white shadow-component xl:col-span-2"
>
    <header class="flex h-20 items-center justify-between border-b border-neutral-100 px-4">
        <h1 class="text-xl font-medium">
            Hole {$activeHole + 1}
        </h1>
        {#if currentShots.length > 0}
            <ParTabs />
        {/if}
    </header>

    <div class="shadow-t-none overflow-x-auto rounded-b-lg">
        <table class="w-full">
            <thead>
                <tr class="text-xs text-neutral-600">
                    {#each ["SHOT", "LOCATION", "DISTANCE", "CLUB", "TAGS"] as val}
                        <th
                            class="border-r border-neutral-100 px-3 py-2.5 text-left last:border-r-0"
                        >
                            {val}
                        </th>
                    {/each}
                    <th class="w-[1%] px-3 py-2.5 text-left">ACTIONS</th>
                </tr>
            </thead>

            <tbody>
                {#if tableData.length > 0}
                    {#each tableData as tData, index}
                        <tr
                            class="whitespace-nowrap border-t border-neutral-100 text-sm [&:nth-child(odd)]:bg-[#F8F8F8]"
                        >
                            {#each Object.values(tData) as val}
                                {#if Array.isArray(val)}
                                    <td
                                        class="border-r border-neutral-100 px-3 py-2.5 last:border-r-0"
                                    >
                                        {#each val.slice(0, 3) as v}
                                            <span
                                                class="mr-1 inline-block rounded bg-neutral-75 px-2 py-1 text-xs font-medium"
                                            >
                                                {v}
                                            </span>
                                        {/each}
                                        {#if val.length > 3}
                                            <HoverCard.Root>
                                                <HoverCard.Trigger
                                                    class="mr-1 inline-block rounded bg-neutral-75 px-2 py-1 text-xs font-medium hover:cursor-pointer"
                                                >
                                                    +{val.length - 3} more
                                                </HoverCard.Trigger>
                                                <HoverCardContent>
                                                    <div class="flex flex-col gap-2">
                                                        {#each val.slice(3) as v}
                                                            <span
                                                                class="inline-block cursor-default rounded bg-neutral-75 px-2 py-1 text-xs font-medium"
                                                            >
                                                                {v}
                                                            </span>
                                                        {/each}
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard.Root>
                                        {/if}
                                    </td>
                                {:else}
                                    <td
                                        class="border-r border-neutral-100 px-3 py-2.5 last:border-r-0"
                                    >
                                        {val}
                                    </td>
                                {/if}
                            {/each}
                            <td class="w-min">
                                <div class="flex justify-center gap-2 text-neutral-600">
                                    <button
                                        class="cursor-pointer"
                                        on:click={() => onDeleteShot(index)}
                                    >
                                        <TrashIcon />
                                    </button>
                                    <button
                                        class="cursor-pointer"
                                        on:click={() => onEditShot(index)}
                                    >
                                        <PencilIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {:else}
                    <tr class="border-t border-neutral-100">
                        <td
                            class="px-4 py-10 text-center text-sm font-medium text-neutral-300"
                            colspan="12"
                        >
                            <div class="flex flex-col items-center justify-center">
                                <div class="mb-2 text-neutral-300">
                                    <HoleIcon />
                                </div>
                                Add shots to the round using the inputs on the left
                            </div>
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
