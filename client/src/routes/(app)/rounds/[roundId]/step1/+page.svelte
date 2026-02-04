<script lang="ts">
    import dayjs from "dayjs";
    import { extractErrors } from "$lib/utils";
    import { toast } from "$lib/components/toast/toast";
    import { setContext } from "svelte";
    import type { ActionData, PageData } from "./$types";
    import { writable } from "svelte/store";
    import Modal from "$lib/components/Modal.svelte";
    import CourseModal from "./CourseModal.svelte";
    import Combobox from "$lib/components/form/Combobox.svelte";
    import Input from "$lib/components/form/Input.svelte";
    import Button from "$lib/components/form/Button.svelte";
    import ArrowNarrowRightIcon from "$lib/icons/ArrowNarrowRightIcon.svelte";
    import PlusCircleIcon from "$lib/icons/PlusCircleIcon.svelte";
    import { enhance } from "$app/forms";

    export let data: PageData;
    export let form: ActionData;

    // TODO - move it to enums
    let type = ["Casual", "Tournament"];

    $: if (form?.error) {
        toast({ message: form.error, type: "error" });
    }
    const formContext = writable();
    $: formContext.set(form);
    setContext("form", formContext);
    let open = false;

    let date = dayjs(data.round.date).format("YYYY-MM-DD");
    let selectedCourse = {
        id: data.round.courseId,
        name: data.courseName,
    };
    let selectedType = data.round.type;
    let selectedTeeTime = data.round.teeTime;
</script>

{#if open}
    <Modal on:close={() => (open = false)}>
        <CourseModal on:close={() => (open = false)} />
    </Modal>
{/if}
<div class="flex w-screen flex-col items-center pt-10">
    <div class="w-full max-w-lg rounded-lg border border-neutral-100 p-8 shadow-lg mb-20">
        <h3 class="mb-6 font-medium">Round details</h3>
        <form action="?/editRoundDetails" method="post" use:enhance>
            <input type="hidden" name="roundId" value={data.round.id} />
            <input type="hidden" name="courseId" value={selectedCourse.id} />
            <input type="hidden" name="type" value={selectedType} />
            <Combobox
                label="Course"
                placeholder="Select course"
                value={selectedCourse.name}
                errors={extractErrors(form, "courseId")}
            >
                <div class="flex w-full flex-col bg-white p-2 font-medium">
                    {#each data.courses.data as course}
                        <button
                            type="button"
                            on:click={() =>
                                (selectedCourse = {
                                    id: course.id,
                                    name: course.name,
                                })}
                            class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                        >
                            {course.name}
                        </button>
                    {/each}

                    <button
                        type="button"
                        class="flex w-full flex-row items-center gap-2 rounded p-2 text-primary-600 hover:bg-neutral-75"
                        on:click={() => (open = true)}
                    >
                        <PlusCircleIcon />
                        Add course
                    </button>
                </div>
            </Combobox>
            <Combobox
                label="Type"
                placeholder="Select type"
                value={selectedType}
                errors={extractErrors(form, "type")}
            >
                <div class="flex w-full flex-col bg-white p-2 font-medium">
                    {#each type as t}
                        <button
                            type="button"
                            on:click={() => (selectedType = t)}
                            class="w-full rounded p-2 text-left hover:cursor-pointer hover:bg-neutral-75"
                        >
                            {t}
                        </button>
                    {/each}
                </div>
            </Combobox>
            <div class="mt-1 flex flex-row gap-6">
                <Input
                    name="date"
                    label="Date"
                    type="date"
                    placeholder="Add date"
                    bind:value={date}
                    errors={extractErrors(form, "date")}
                />
                <Input
                    name="teeTime"
                    label="Tee time (optional)"
                    type="time"
                    placeholder="Add time"
                    bind:value={selectedTeeTime}
                    errors={extractErrors(form, "teeTime")}
                />
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
