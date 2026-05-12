<script lang="ts">
    import { getContext } from "svelte";
    import type { Context } from "./context";
    import { enhance } from "$app/forms";

    const { data, activeHole } = getContext<Context>("context");

    $: hole = $data.holes.find((el) => el.hole === $activeHole + 1);
</script>

{#if hole}
    <div class="flex w-fit gap-1 rounded-lg bg-neutral-75 p-1 text-sm text-neutral-600">
        {#each [3, 4, 5] as tabOption}
            <form action="?/updateHole" method="post" use:enhance>
                <input type="hidden" name="id" value={hole.id} />
                <input type="hidden" name="par" value={tabOption} />
                <button
                    class="flex cursor-pointer justify-center whitespace-nowrap rounded-lg px-3 py-2.5 align-middle text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-white
            {hole.par === tabOption ? 'bg-white text-neutral-900' : 'bg-neutral-75'}"
                >
                    Par {tabOption}
                </button>
            </form>
        {/each}
    </div>
{/if}
