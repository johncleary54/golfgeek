<script lang="ts">
    import CheckIcon from "$lib/icons/CheckIcon.svelte";
    import { fly } from "svelte/transition";

    export let step: string;
    export let steps: string[];
</script>

<ol class="-ml-8 flex w-full max-w-7xl items-center px-16">
    {#each steps as s, i}
        <li
            class="flex items-center text-primary-600 after:inline-block after:h-[2px] after:w-full after:border-2 after:border-b after:content-['']
            {i === steps.length - 1 ? 'w-0' : 'w-full'}
            {step < String(i + 1) ? 'after:border-neutral-100' : 'after:border-primary-600'}
            "
            class:after:border-none={i === steps.length - 1}
        >
            <span
                class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                {step < String(i + 1) ? 'bg-neutral-100' : 'bg-primary-600'}
                {step === String(i + 1) ? 'shadow-step' : ''}
                "
            >
                {#if step <= String(i + 1)}
                    <span
                        class="h-3 w-3 rounded-full bg-white {step === String(i + 1) &&
                            'animate-pulse'}"
                    />
                {:else}
                    <div class="text-white" transition:fly={{ x: -50, duration: 200 }}>
                        <CheckIcon />
                    </div>
                {/if}
                <p
                    class="absolute left-1/2 top-10 -translate-x-1/2 transform whitespace-nowrap font-medium text-primary-600"
                >
                    {s}
                </p>
            </span>
        </li>
    {/each}
</ol>
