<script lang="ts">
    import { extractErrors } from "$lib/utils";
    import { toast } from "$lib/components/toast/toast";
    import type { ActionData, PageData } from "./$types";
    import Combobox from "$lib/components/form/Combobox.svelte";
    import Button from "$lib/components/form/Button.svelte";
    import ArrowNarrowRightIcon from "$lib/icons/ArrowNarrowRightIcon.svelte";
    import { enhance } from "$app/forms";

    export let data: PageData;
    export let form: ActionData;

    // TODO - move it to enums
    const temperture = ["Very Cold", "Cold", "Normal", "Warm", "Very Warm"];
    const wind = ["Calm", "Light Breeze", "Moderate Breeze", "Strong Breeze", "Gale"];
    const precipitation = [
        "No Rain",
        "Light Rain",
        "Moderate Rain",
        "Heavy Rain",
        "Very Heavy Rain",
    ];
    const firmness = ["Very Soft", "Soft", "Normal", "Firm", "Very Firm"];
    const height = ["Very Short", "Short", "Average", "Long", "Very Long"];
    const smoothness = ["Very Smooth", "Smooth", "Average", "Bumpy", "Very Bumpy"];
    const speed = ["Very Slow", "Slow", "Normal", "Fast", "Very Fast"];

    $: if (form?.error) {
        toast({ message: form.error, type: "error" });
    }
</script>

<div class="relative mx-auto flex w-full max-w-screen-2xl justify-center px-6 py-10">
    <div class="w-full max-w-lg rounded-lg border border-neutral-100 p-8 shadow-lg">
        <h3 class="mb-6 font-medium">Conditions</h3>
        <form action="?/editConditions" method="post" use:enhance>
            <p class="mb-4">Weather Conditions</p>
            <input type="hidden" name="roundId" value={data.round.id} />
            <input type="hidden" name="temperature" value={data.round.temperature} />
            <input type="hidden" name="wind" value={data.round.wind} />
            <input type="hidden" name="precipitation" value={data.round.precipitation} />
            <input type="hidden" name="firmness" value={data.round.firmness} />
            <input type="hidden" name="height" value={data.round.height} />
            <input type="hidden" name="smoothness" value={data.round.smoothness} />
            <input type="hidden" name="speed" value={data.round.speed} />

            <Combobox
                label="Temperature"
                placeholder="Add temperature"
                value={data.round.temperature}
                errors={extractErrors(form, "temperature")}
            >
                <div class="flex w-full flex-col bg-white p-2 font-medium">
                    {#each temperture as val}
                        <button
                            type="button"
                            on:click={() => (data.round.temperature = val)}
                            class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                        >
                            {val}
                        </button>
                    {/each}
                </div>
            </Combobox>
            <div class="flex flex-row gap-6">
                <Combobox
                    label="Wind"
                    placeholder="Add wind"
                    value={data.round.wind}
                    errors={extractErrors(form, "wind")}
                >
                    <div class="flex w-full flex-col bg-white p-2 font-medium">
                        {#each wind as val}
                            <button
                                type="button"
                                on:click={() => (data.round.wind = val)}
                                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                            >
                                {val}
                            </button>
                        {/each}
                    </div>
                </Combobox>
                <Combobox
                    label="Precipitation"
                    placeholder="Add precipitation"
                    value={data.round.precipitation}
                    errors={extractErrors(form, "precipitation")}
                >
                    <div class="flex w-full flex-col bg-white p-2 font-medium">
                        {#each precipitation as val}
                            <button
                                type="button"
                                on:click={() => (data.round.precipitation = val)}
                                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                            >
                                {val}
                            </button>
                        {/each}
                    </div>
                </Combobox>
            </div>
            <hr />
            <p class="my-4">Off green Conditions</p>
            <div class="flex flex-row gap-6">
                <Combobox
                    label="Course Firmness"
                    placeholder="Add firmness"
                    value={data.round.firmness}
                    errors={extractErrors(form, "firmness")}
                >
                    <div class="flex w-full flex-col bg-white p-2 font-medium">
                        {#each firmness as val}
                            <button
                                type="button"
                                on:click={() => (data.round.firmness = val)}
                                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                            >
                                {val}
                            </button>
                        {/each}
                    </div>
                </Combobox>
                <Combobox
                    label="Rough Height"
                    placeholder="Add height"
                    value={data.round.height}
                    errors={extractErrors(form, "height")}
                >
                    <div class="flex w-full flex-col bg-white p-2 font-medium">
                        {#each height as val}
                            <button
                                type="button"
                                on:click={() => (data.round.height = val)}
                                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                            >
                                {val}
                            </button>
                        {/each}
                    </div>
                </Combobox>
            </div>
            <hr />
            <p class="my-4">Green Conditions</p>
            <div class="flex flex-row gap-6">
                <Combobox
                    label="Green Smoothness"
                    placeholder="Add smoothness"
                    value={data.round.smoothness}
                    errors={extractErrors(form, "smoothness")}
                    above
                >
                    <div class="flex w-full flex-col bg-white p-2 font-medium">
                        {#each smoothness as val}
                            <button
                                type="button"
                                on:click={() => (data.round.smoothness = val)}
                                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                            >
                                {val}
                            </button>
                        {/each}
                    </div>
                </Combobox>
                <Combobox
                    label="Green Speed"
                    placeholder="Add speed"
                    value={data.round.speed}
                    errors={extractErrors(form, "speed")}
                    above
                >
                    <div class="flex w-full flex-col bg-white p-2 font-medium">
                        {#each speed as val}
                            <button
                                type="button"
                                on:click={() => (data.round.speed = val)}
                                class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                            >
                                {val}
                            </button>
                        {/each}
                    </div>
                </Combobox>
            </div>
            <div class="ml-auto w-fit">
                <Button type="submit">
                    Save and continue
                    <svelte:fragment slot="icon">
                        <ArrowNarrowRightIcon />
                    </svelte:fragment>
                </Button>
            </div>
        </form>
    </div>
</div>
