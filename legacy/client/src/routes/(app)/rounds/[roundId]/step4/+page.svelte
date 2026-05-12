<script lang="ts">
    import PencilIcon from "$lib/icons/PencilIcon.svelte";
    import { page } from "$app/stores";
    import Button from "$lib/components/form/Button.svelte";
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
    } from "$lib/components/accordion";
    import type { PageData } from "./$types";

    export let data: PageData;

    let { round, courseName, totalPar, totalScore } = data;
    const roundId = $page.params.roundId;
</script>

<div class="relative mx-auto flex w-full max-w-screen-2xl justify-center px-6 py-10">
    <div class="w-full max-w-3xl rounded-lg border border-neutral-100 bg-white p-6 shadow-lg">
        <h1 class="text-xl font-medium">Review round</h1>

        <Accordion type="multiple" class="py-3">
            <AccordionItem value="round" class="border-b-0">
                <AccordionTrigger class="border-b-0">
                    <div class="flex gap-3">
                        <h2 class="text-base font-medium">Round details</h2>
                        <a
                            href="/rounds/{roundId}/step1"
                            class="flex items-center justify-center gap-2 text-sm font-medium text-primary-600"
                        >
                            <PencilIcon />
                            Edit
                        </a>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ul class="mt-4 space-y-2">
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Course</span>
                            <span class="text-sm font-medium">
                                {courseName}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Date</span>
                            <span class="text-sm font-medium">
                                {new Date(round.date).toDateString()}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Tee Time</span>
                            <span class="text-sm font-medium">
                                {round.teeTime || "-"}
                            </span>
                        </li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="conditions" class="border-b-0">
                <AccordionTrigger class="border-b-0">
                    <div class="flex gap-3">
                        <h2 class="text-base font-medium">Conditions</h2>
                        <a
                            href="/rounds/{roundId}/step2"
                            class="flex items-center justify-center gap-2 text-sm font-medium text-primary-600"
                        >
                            <PencilIcon />
                            Edit
                        </a>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ul class="mt-4 space-y-2">
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Temperature</span>
                            <span class="text-sm font-medium">
                                {round.temperature || "-"}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Wind</span>
                            <span class="text-sm font-medium">
                                {round.wind || "-"}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Precipitation</span>
                            <span class="text-sm font-medium">
                                {round.precipitation || "-"}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Green smoothness</span>
                            <span class="text-sm font-medium">
                                {round.smoothness || "-"}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Green speed</span>
                            <span class="text-sm font-medium">
                                {round.speed || "-"}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Course firmness</span>
                            <span class="text-sm font-medium">
                                {round.firmness || "-"}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Rough height</span>
                            <span class="text-sm font-medium">
                                {round.height || "-"}
                            </span>
                        </li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shot" class="border-b-0">
                <AccordionTrigger class="border-b-0">
                    <div class="flex gap-3">
                        <h2 class="text-base font-medium">Shot data</h2>
                        <a
                            href="/rounds/{roundId}/step3"
                            class="flex items-center justify-center gap-2 text-sm font-medium text-primary-600"
                        >
                            <PencilIcon />
                            Edit
                        </a>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ul class="mt-4 space-y-2">
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Par</span>
                            <span class="text-sm font-medium">
                                {totalPar}
                            </span>
                        </li>
                        <li class="flex justify-between border-b border-neutral-100 pb-2">
                            <span class="text-sm text-neutral-600">Score total</span>
                            <span class="text-sm font-medium">
                                {totalScore}
                            </span>
                        </li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        <div class="flex items-center justify-between">
            <Button href="/rounds/{roundId}/step3" size="sm" variant="secondary">Back</Button>
            <Button size="sm" href="/rounds">Analyse Round</Button>
        </div>
    </div>
</div>
