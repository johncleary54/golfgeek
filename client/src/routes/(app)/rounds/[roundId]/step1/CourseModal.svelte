<script lang="ts">
    import { enhance } from "$app/forms";
    import Button from "$lib/components/form/Button.svelte";
    import Input from "$lib/components/form/Input.svelte";
    import { getContext } from "svelte";
    import { createEventDispatcher } from "svelte";
    import type { Writable } from "svelte/store";
    import { toast } from "$lib/components/toast/toast";
    import { page } from "$app/stores";
    import { extractErrors } from "$lib/utils";
    import type { ActionData } from "./$types";

    const dispatch = createEventDispatcher();
    const form = getContext<Writable<ActionData>>("form");

    let course = "";
    let loading = false;
</script>

<dialog class="flex min-w-[460px] flex-col gap-6 rounded-lg bg-white p-6">
    <h2 class="font-medium">Add new course</h2>
    <form
        action="?/addCourse"
        method="post"
        use:enhance={() => {
            loading = true;
            return async ({ result, update }) => {
                await update({ reset: false });
                if (result.type === "success") {
                    toast({
                        message: "Course added successfully",
                        type: "success",
                    });
                }
                dispatch("close");
                loading = false;
            };
        }}
    >
        <input type="hidden" name="roundId" value={$page.params.roundId} />
        <Input
            name="name"
            label="Course name"
            placeholder="Enter course name"
            bind:value={course}
            errors={extractErrors($form, "name")}
        />
        <div class="mt-2 flex flex-row gap-4">
            <Button type="button" variant="secondary" on:click={() => dispatch("close")}>
                Cancel
            </Button>
            <Button {loading}>Add course</Button>
        </div>
    </form>
</dialog>
