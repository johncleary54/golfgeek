<script lang="ts">
    import Button from "$lib/components/form/Button.svelte";
    import ArrowNarrowRightIcon from "$lib/icons/ArrowNarrowRightIcon.svelte";
    import ScoreCard from "./ScoreCard.svelte";
    import ArrowNarrowLeftIcon from "$lib/icons/ArrowNarrowLeftIcon.svelte";
    import AddShotForm from "./AddShotForm.svelte";
    import type { ActionData, PageData } from "./$types";
    import HoleTable from "./HoleTable.svelte";
    import { writable } from "svelte/store";
    import { setContext } from "svelte";
    import type { Context } from "./context";
    import { page } from "$app/stores";
    import { ShotLocation } from "$lib/types";

    export let data: PageData;
    export let form: ActionData;

    let activeHole = writable(0);

    let storeData = writable<PageData>();
    $: storeData.set(data);

    let storeForm = writable<ActionData>();
    $: storeForm.set(form);

    let shotForm = writable({
        id: "",
        shotNumber: "",
        location: ShotLocation.Unknown,
        distance: "",
        club: "",
        tags: "",
    });

    let isEditing = writable(false);

    setContext<Context>("context", {
        data: storeData,
        form: storeForm,
        shotForm,
        activeHole,
        isEditing,
    });
</script>

<div class="relative mx-auto w-full max-w-screen-2xl space-y-8 px-6 py-6">
    <ScoreCard />

    <div class="grid w-full gap-8 xl:grid-cols-3">
        <AddShotForm />
        <HoleTable />
    </div>
    <div class="flex justify-end whitespace-nowrap">
        <div class="flex gap-4">
            {#if $activeHole > 0}
                <Button
                    iconPosition="left"
                    variant="secondary"
                    on:click={() => {
                        activeHole.set($activeHole - 1);
                        shotForm.set({
                            id: "",
                            shotNumber: "",
                            location: ShotLocation.Unknown,
                            distance: "",
                            club: "",
                            tags: "",
                        });
                    }}
                >
                    <span class="hidden sm:block">Previous</span>
                    <svelte:fragment slot="icon">
                        <ArrowNarrowLeftIcon />
                    </svelte:fragment>
                </Button>
            {/if}
            {#if $activeHole <= 16}
                <Button
                    variant="secondary"
                    on:click={() => {
                        activeHole.set($activeHole + 1);
                        shotForm.set({
                            id: "",
                            shotNumber: "",
                            location: ShotLocation.Unknown,
                            distance: "",
                            club: "",
                            tags: "",
                        });
                    }}
                >
                    <span class="hidden sm:block">Next</span>
                    <svelte:fragment slot="icon">
                        <ArrowNarrowRightIcon />
                    </svelte:fragment>
                </Button>
            {/if}
            <Button href="/rounds/{$page.params.roundId}/step4" variant="primary">
                Review Round
            </Button>
        </div>
    </div>
</div>
