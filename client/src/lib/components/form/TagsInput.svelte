<script lang="ts">
    import EnterIcon from "$lib/icons/EnterIcon.svelte";

    export let disabled = false;
    export let tags: string;
    $: tagsArray = tags.split(",").filter((tag) => tag !== "");
    let newTag = "";

    export let label: string;
    export let errors: string[] = [];

    function addTag(): void {
        if (newTag.trim() !== "") {
            tagsArray = [...tagsArray, newTag];
            tags = tagsArray.filter((tag) => tag !== "").join(",");
            newTag = "";
        }
    }

    function removeTag(tag: string): void {
        tagsArray = tagsArray.filter((t) => t !== tag);
        tags = tagsArray.filter((t) => t !== "").join(",");
        newTag = "";
    }
</script>

<div class="relative flex w-full flex-col">
    {#if label}
        <p class="mb-1 flex w-full flex-col whitespace-nowrap text-left text-sm text-neutral-600">
            {label}
        </p>
    {/if}

    <div
        class="flex h-12 w-full flex-row items-center justify-between rounded-lg border bg-white px-4 text-neutral-600 shadow {errors.length >
        0
            ? 'border-error-600'
            : 'border-neutral-100'} {disabled ? 'cursor-not-allowed opacity-50' : ''}"
    >
        <div class="flex overflow-x-auto">
            {#if tagsArray.length > 0}
                <div class="flex gap-2 pr-2">
                    {#each tagsArray as tag}
                        <div
                            class="flex flex-row items-center gap-2 rounded bg-neutral-75 px-2 py-[2px]"
                        >
                            <span class="whitespace-nowrap text-neutral-900">
                                {tag}
                            </span>
                            <button
                                type="button"
                                class="text-neutral-600"
                                on:click={() => removeTag(tag)}
                            >
                                x
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
            {#if tagsArray.length < 4}
                <input
                    type="text"
                    bind:value={newTag}
                    placeholder="Add a tag"
                    class="w-full bg-transparent outline-none placeholder:text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    on:blur={addTag}
                    on:keydown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            addTag();
                        }

                        if (event.key === "Backspace" && newTag === "" && tagsArray.length > 0) {

                            removeTag(tagsArray[tagsArray.length - 1] ?? "");
                        }
                    }}
                    {disabled}
                />
            {/if}
        </div>

        <div class="flex items-center justify-center bg-white pl-4">
            <EnterIcon />
        </div>
    </div>

    <p class="h-6 pt-1 text-left text-sm text-error-600">{errors.join(", ")}</p>
</div>
