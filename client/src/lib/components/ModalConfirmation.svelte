<script lang="ts">
    import { enhance } from "$app/forms";
    import Modal from "./Modal.svelte";
    import Button from "./form/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import { toast } from "./toast/toast";
    import { invalidateAll } from "$app/navigation";

    export let action: string;
    export let args: Record<string, string>;

    let loading = false;
    const dispatch = createEventDispatcher();
</script>

<Modal on:close>
    <dialog class="flex min-w-[460px] flex-col gap-6 rounded-lg bg-white p-6">
        <form
            action="?/{action}"
            method="post"
            use:enhance={() => {
                loading = true;
                return async ({ result }) => {
                    if (result.type === "success") {
                        toast({
                            message: "Item deleted successfully",
                            type: "success",
                        });
                        await invalidateAll();
                    }
                    dispatch("close");
                    loading = false;
                };
            }}
        >
            {#each Object.entries(args) as [key, value]}
                <input type="hidden" name={key} {value} />
            {/each}
            <h2 class="mb-4 font-medium">Are you sure You want to delete this?</h2>
            <div class="flex flex-row gap-2">
                <Button {loading} class="w-full" variant="secondary">Delete</Button>
                <Button
                    type="button"
                    class="w-full"
                    variant="primary"
                    on:click={() => {
                        dispatch("close");
                    }}
                >
                    Cancel
                </Button>
            </div>
        </form>
    </dialog>
</Modal>
