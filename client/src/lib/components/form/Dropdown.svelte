<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    // TODO: Switch to Radix when they make Dropdown component

    export let full = false;
    export let above = false;
    export let disabled = false;
    let open = false;

    const transitionConfig = {
        duration: 100,
        delay: 0,
        easing: cubicInOut,
    };

    function cubicInOut(t: number): number {
        if (t < 0.5) return 4 * t * t * t;
        return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function useClickOutisde(node: HTMLElement): { destroy: () => void } {
        const handleClick = (event: MouseEvent): void => {
            if (!node.contains(event.target as Node)) {
                open = false;
            }
        };
        document.addEventListener("click", handleClick);
        return {
            destroy() {
                document.removeEventListener("click", handleClick);
            },
        };
    }

    // Close on window resize
    onMount(() => {
        function closeDropdown(): void {
            open = false;
        }

        window.addEventListener("resize", closeDropdown);
        return () => {
            window.removeEventListener("resize", closeDropdown);
        };
    });
</script>

<div use:useClickOutisde>
    <button
        type="button"
        class="flex w-full self-center disabled:cursor-not-allowed disabled:opacity-50"
        on:click={() => {
            open = !open;
        }}
        {disabled}
    >
        <slot name="button" />
    </button>
    <div
        class="relative"
        on:keypress={() => {
            open = false;
        }}
        on:click={() => {
            open = false;
        }}
    >
        {#if open}
            <div
                class="absolute right-0 z-10 max-h-[250px] overflow-y-scroll whitespace-nowrap rounded-lg border border-neutral-100 bg-white shadow-lg
                {full ? 'w-full' : 'w-fit'}
                {above ? 'bottom-[52px]' : 'top-1'}"
                transition:fade={transitionConfig}
            >
                <slot name="dropdown" />
            </div>
        {/if}
    </div>
</div>
