<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import Button from "$lib/components/form/Button.svelte";
    import Combobox from "$lib/components/form/Combobox.svelte";
    import Input from "$lib/components/form/Input.svelte";
    import TagsInput from "$lib/components/form/TagsInput.svelte";
    import { toast } from "$lib/components/toast/toast";
    import PlusCircleIcon from "$lib/icons/PlusCircleIcon.svelte";
    import { extractErrors } from "$lib/utils";
    import { getContext } from "svelte";
    import type { Context } from "./context";
    import { ShotClub, ShotLocation } from "$lib/types";

    const { data, form, activeHole, shotForm, isEditing } = getContext<Context>("context");

    let isPenalty = false;
    $: isPenalty = $shotForm.location === ShotLocation.Penalty;

    $: currentShots = $data.shots.filter((shot) => shot.hole === $activeHole + 1);

    $: currentShotNumber = $shotForm.shotNumber || currentShots.length + 1;
    let loading = false;

    $: {
        if (currentShotNumber === 1 && !$shotForm.location) {
            shotForm.set({ ...$shotForm, location: ShotLocation.Tee });
        } else if (
            Number(currentShotNumber) > 1 &&
            !$shotForm.location &&
            currentShots.length > 0
        ) {
            const previousShot = currentShots[currentShots.length - 1];
            if (previousShot) {
                const previousShotLocation = previousShot.location;
                if (previousShotLocation === ShotLocation.Green) {
                    shotForm.set({
                        ...$shotForm,
                        location: ShotLocation.Green,
                        club: ShotClub.Putter,
                    });
                } else {
                    shotForm.set({ ...$shotForm, location: ShotLocation.Unknown });
                }
            }
        }
    }

    $: {
        if (isPenalty) {
            shotForm.set({
                ...$shotForm,
                distance: "",
                club: "",
                tags: "",
            });
        }
    }
</script>

<div
    class="shadow-component h-fit w-full rounded-lg border border-neutral-100 bg-white p-6 xl:col-span-1"
>
    <h3 class="mb-6 font-medium">Shot {currentShotNumber}</h3>
    <form
        action="?/addShot"
        method="post"
        use:enhance={() => {
            loading = true;
            return async ({ result }) => {
                if (result.type === "success") {
                    toast({
                        message: "Shot added successfully",
                        type: "success",
                    });
                    await invalidateAll();
                    let newLocation = ShotLocation.Unknown;
                    if ($shotForm.location === ShotLocation.Green) {
                        newLocation = ShotLocation.Green;
                    }
                    shotForm.set({
                        id: "",
                        shotNumber: "",
                        location: newLocation,
                        distance: "",
                        club: "",
                        tags: "",
                    });
                    isEditing.set(false);
                }
                await applyAction(result);
                loading = false;
            };
        }}
    >
        <input type="hidden" name="id" value={$shotForm.id} />
        <input type="hidden" name="roundId" value={$page.params.roundId} />
        <input type="hidden" name="hole" value={$activeHole + 1} />
        <input type="hidden" name="location" value={$shotForm.location} />
        <input type="hidden" name="distance" value={$shotForm.distance} />
        <input type="hidden" name="club" value={$shotForm.club} />
        <input type="hidden" name="tags" value={$shotForm.tags} />

        <div class="flex-row gap-6 sm:flex">
            <Combobox
                label="Location"
                placeholder="Add location"
                bind:value={$shotForm.location}
                errors={extractErrors($form, "location")}
            >
                <div class="flex w-full flex-col bg-white p-2 font-medium">
                    {#each Object.values(ShotLocation) as location}
                        <button
                            type="button"
                            on:click={() => {
                                shotForm.set({
                                    ...$shotForm,
                                    location: location,
                                });
                            }}
                            class="hover:bg-neutral-75 w-full rounded p-2 text-left hover:cursor-pointer"
                        >
                            {location}
                        </button>
                    {/each}
                </div>
            </Combobox>
            <Input
                name="distance"
                label="Distance to hole {$shotForm.location === ShotLocation.Green
                    ? '(ft)'
                    : '(yards)'}"
                placeholder="Add distance"
                bind:value={$shotForm.distance}
                errors={extractErrors($form, "distance")}
                disabled={isPenalty}
                type="number"
            />
        </div>

        <Combobox
            label="Club (optional)"
            placeholder="Add club"
            bind:value={$shotForm.club}
            errors={extractErrors($form, "club")}
            above
            disabled={isPenalty}
        >
            <div class="flex w-full flex-col bg-white p-2 font-medium">
                {#each Object.values(ShotClub) as club}
                    <button
                        type="button"
                        on:click={() => {
                            if (club === ShotClub.None) {
                                shotForm.set({ ...$shotForm, club: "" });
                                return;
                            }
                            shotForm.set({ ...$shotForm, club: club });
                        }}
                        class="hover:bg-neutral-75 w-full rounded p-2 text-left hover:cursor-pointer"
                    >
                        {club}
                    </button>
                {/each}
            </div>
        </Combobox>

        <TagsInput
            bind:tags={$shotForm.tags}
            errors={extractErrors($form, "tags")}
            label="Tags (optional)"
            disabled={isPenalty}
        />

        <div class="ml-auto flex w-full {$isEditing ? 'justify-between' : 'justify-end'}">
            {#if $isEditing}
                <div class="flex gap-4">
                    <div class="text-primary-500 flex items-center gap-2 align-middle text-sm">
                        <PlusCircleIcon />
                        <button
                            class="text-primary-500 cursor-pointer font-medium"
                            on:click={() => {
                                shotForm.set({
                                    id: "",
                                    shotNumber: "",
                                    location: ShotLocation.Unknown,
                                    distance: "",
                                    club: "",
                                    tags: "",
                                });
                                isEditing.set(false);
                            }}
                        >
                            Add another shot
                        </button>
                    </div>
                </div>
            {/if}
            <Button
                iconPosition="left"
                {loading}
                disabled={isPenalty
                    ? !$shotForm.location
                    : !$shotForm.location || !$shotForm.distance}
            >
                Update Scorecard
                <svelte:fragment slot="icon">
                    <PlusCircleIcon />
                </svelte:fragment>
            </Button>
        </div>
    </form>
</div>
