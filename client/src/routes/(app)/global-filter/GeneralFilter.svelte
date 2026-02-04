<script lang="ts">
    import Input from "$lib/components/form/Input.svelte";
    import { getContext } from "svelte";
    import type { Course } from "$lib/server/rounds/course.service";
    import { selectedFilters } from "./filterService";
    import Combobox from "$lib/components/form/Combobox.svelte";

    let courses = getContext<Course[]>("courses");
</script>

<!-- TODO: Hidden filter for tee time at bottom, refactor to combobox at later date  -->

<Combobox
    label="Course"
    placeholder="Select course"
    value={$selectedFilters.courseName}
    errors={[]}
>
    <div class="flex w-full flex-col bg-white p-2 font-medium">
        {#if courses.length === 0}
            <p class="text-center">No courses found</p>
        {:else}
            {#each courses as course}
                <button
                    type="button"
                    on:click={() =>
                        selectedFilters.update((filters) => ({
                            ...filters,
                            courseName: course.name,
                            courseId: course.id,
                        }))}
                    class="hover:bg-neutral-75 w-full rounded p-2 text-left hover:cursor-pointer"
                >
                    {course.name}
                </button>
            {/each}
        {/if}
    </div>
</Combobox>

<div class="">
    <Input
        name="fromDate"
        label="Date from"
        type="date"
        placeholder="Add date"
        bind:value={$selectedFilters.fromDate}
        errors={[]}
    />
</div>

<Input
    name="toDate"
    label="Date to"
    type="date"
    placeholder="Add date"
    bind:value={$selectedFilters.toDate}
    errors={[]}
/>

<!-- <Input
    name="teeTime"
    label="Tee time (optional)"
    type="time"
    placeholder="Add time"
    bind:value={$selectedFilters.teeTime}
    errors={[]}
/> -->
