<script lang="ts">
    import HowItWorks from "$lib/assets/HowItWorks.svelte";

    let isHovered = false;
    let hoverCircle: 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined = undefined;

    const HoverCircleText: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string> = {
        1: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
        2: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
        3: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
        4: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
        5: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
        6: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
        7: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    };

    const HoverCircleTitles: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, string> = {
        1: "Per Shot/Round",
        2: "Shot Type",
        3: "Benchmarks",
        4: "Goals",
        5: "Current Score",
        6: "Goal or Player Benchmark",
        7: "Slider",
    };
</script>

<dialog class="flex flex-col gap-6 rounded-lg bg-white p-8">
    <div class="space-y-2">
        <h1 class="text-3xl font-medium">Benchmarks</h1>
        <h2 class="max-w-3xl text-base font-normal text-neutral-600">
            Hover one of the number icons to see an explanation of the strokes gained predictor
            model.
        </h2>
    </div>
    <HowItWorks bind:isHovered bind:hoverCircle />
    <div class="space-y-2">
        <h3 class="text-xl font-medium">
            {#if isHovered}
                {HoverCircleTitles[hoverCircle ?? 1]}
            {:else}
                Try hovering over one of the numbers.
            {/if}
        </h3>
        <h2 class="h-12 max-w-3xl text-base font-normal text-neutral-600">
            {#if isHovered}
                {HoverCircleText[hoverCircle ?? 1]}
            {:else}
                Hover over one of the numbers to see an explanation of the item you are hovering
                over.
            {/if}
        </h2>
    </div>
</dialog>
