<script lang="ts">
    import type { AuthProviderInfo } from "pocketbase";
    import Microsoft from "$lib/icons/MicrosoftIcon.svelte";
    import Google from "$lib/icons/GoogleIcon.svelte";
    import Apple from "$lib/icons/AppleIcon.svelte";
    import { capitalizeFirstLetter } from "$lib/utils";
    import Button from "$lib/components/form/Button.svelte";

    export let provider: AuthProviderInfo;
    export let onSignIn: (provider: AuthProviderInfo) => Promise<void>;
    export let loading = false;
</script>

<Button {loading} variant="secondary" on:click={() => onSignIn(provider)}>
    <svelte:fragment slot="icon">
        {#if provider.name === "microsoft"}
            <Microsoft />
        {:else if provider.name === "google"}
            <Google />
        {:else if provider.name === "apple"}
            <Apple />
        {/if}
    </svelte:fragment>
    Continue with {capitalizeFirstLetter(provider.name)}
</Button>
