<script lang="ts">
    import SgpSlider from "$lib/components/SGPSlider.svelte";
    // import StrokesGainedBar from "$lib/components/StrokesGainedBar.svelte";

    export let strokesGained: number;
</script>

<div class="grid-col-1 grid items-end gap-2 md:grid-cols-9">
    <div class="mb-3 flex flex-1 flex-col justify-center md:col-span-8 md:mb-0">
        <div class="items-center justify-between pb-2 md:flex">
            <h5
                class="flex items-center gap-2 text-sm font-normal text-neutral-600 md:justify-between"
            >
                Predicted strokes gained per shot
            </h5>
        </div>

        <SgpSlider height={10} {strokesGained} />
    </div>

    <div
        class={"flex h-10 items-center justify-center rounded text-2xl md:col-span-1 " +
            (strokesGained < 0 ? "bg-error-50 text-error-600 " : "") +
            (strokesGained > 0 ? "bg-success-50 text-success-600 " : "") +
            (strokesGained === 0 ? "bg-neutral-50 text-neutral-600 " : "")}
    >
        {strokesGained}
    </div>
</div>
<div class="flex justify-between pt-2 text-sm font-normal text-neutral-600" />
