<script lang="ts">
    import { page } from "$app/stores";
    import ArrowNarrowLeftIcon from "$lib/icons/ArrowNarrowLeftIcon.svelte";
    import Steps from "./Steps.svelte";

    function getCurrentStep(lastUrlSegment: undefined | string): "1" | "2" | "3" | "4" {
        if (lastUrlSegment === "step1") {
            return "1";
        } else if (lastUrlSegment === "step2") {
            return "2";
        } else if (lastUrlSegment === "step3") {
            return "3";
        } else if (lastUrlSegment === "step4") {
            return "4";
        }
        return "1";
    }

    const roundId = $page.params.roundId;
    $: lastUrlSegment = $page.url.pathname.split("/").pop();
    $: step = getCurrentStep(lastUrlSegment);
    const steps = ["Round details", "Conditions", "Shot data", "Review"];
</script>

{#if step > "1"}
    <a
        href="/rounds/{roundId}/step{parseInt(getCurrentStep(lastUrlSegment)) - 1}"
        class="absolute left-4 top-4 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline md:left-8 md:top-8 md:text-base"
    >
        <div class="flex items-center gap-1 text-primary-500">
            <ArrowNarrowLeftIcon />

            Back
        </div>
    </a>
{/if}
<div class="flex w-screen flex-col items-center pt-10">
    <h1 class="mb-8">Add a round</h1>
    <Steps {steps} {step} />
    <span class="mb-10" />
    <slot />
</div>
