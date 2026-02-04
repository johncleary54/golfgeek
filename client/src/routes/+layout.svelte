<script lang="ts">
    import "../app.css";
    import Toast from "$lib/components/toast/Toast.svelte";
    import { toastStore } from "$lib/components/toast/toast";
</script>

<div class="fixed right-10 top-12 z-[1000] flex flex-col gap-2">
    {#each $toastStore as toast}
        <Toast {toast} />
    {/each}
</div>

<slot />
