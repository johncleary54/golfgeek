<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Toast } from "./toast";
    import { toastStore } from "./toast";
    export let toast: Toast;

    setTimeout(() => {
        // remove first toast
        toastStore.update((toasts) => {
            return toasts.slice(1);
        });
    }, 3000);
</script>

<div
    transition:fade={{ duration: 200 }}
    class="z-[1000] w-fit rounded-md border-l-4 bg-neutral-50 px-4 py-2 shadow-lg
    {toast.type === 'success' ? 'border-green-500' : 'border-red-500'}"
>
    {toast.message}
</div>
