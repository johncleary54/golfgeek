<script lang="ts">
    import { page } from "$app/stores";
    import Loader from "$lib/components/Loader.svelte";
    import Button from "$lib/components/form/Button.svelte";

    let status = $page.url.searchParams.get("status") ?? "";

    // wait for 3 sec to let webhook update the payment status
    let loading = true;
    setTimeout(() => {
        loading = false;
    }, 3000);
</script>

{#if loading}
    <div class="flex h-screen items-center justify-center">
        <Loader />
    </div>
{:else}
    <h1>Payment status: {status}</h1>

    <div class="mt-4 w-fit">
        <Button href="/billing" variant="secondary">Back to billing</Button>
    </div>
{/if}
