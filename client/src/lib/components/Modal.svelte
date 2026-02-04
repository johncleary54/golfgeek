<script lang="ts">
    import { trapfocus } from "$lib/utils";
    import { createEventDispatcher } from "svelte";
    import { fade, scale } from "svelte/transition";

    const dispatch = createEventDispatcher();
</script>

<svelte:window
    on:keydown={(e) => {
        if (e.key === "Escape") {
            dispatch("close");
        }
    }}
/>

<div
    class="fixed left-0 top-0 z-30 h-screen w-screen bg-neutral-600 bg-opacity-50 backdrop-blur-lg"
    use:trapfocus
    transition:fade={{ duration: 200 }}
>
    <div
        class="fixed flex h-screen w-screen items-center justify-center"
        transition:scale={{ start: 0.95, duration: 200 }}
        on:keypress={(e) => {
            if (e.target === e.currentTarget) {
                dispatch("close");
            }
        }}
        on:click={(e) => {
            if (e.target === e.currentTarget) {
                dispatch("close");
            }
        }}
    >
        <slot />
    </div>
</div>
