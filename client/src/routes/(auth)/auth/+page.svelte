<script lang="ts">
    import type { AuthProviderInfo } from "pocketbase";
    import ProviderButton from "./ProviderButton.svelte";
    import { PUBLIC_API_URI } from "$env/static/public";
    import type { PageData } from "./$types";
    import PocketBase from "pocketbase";
    import { toast } from "$lib/components/toast/toast";

    export let data: PageData;

    const pb = new PocketBase(PUBLIC_API_URI);
    let form: HTMLFormElement;

    const onSignIn = async (provider: AuthProviderInfo): Promise<void> => {
        try {
            await pb.collection("users").authWithOAuth2({ provider: provider.name });

            const token = pb.authStore.token;
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "token";
            input.value = token;
            form.appendChild(input);
            form.submit();
        } catch (e) {
            console.error(e);
            toast({
                message: "Failed to sign in",
                type: "error",
            });
        }
    };

    // async function onTestSignIn(): Promise<void> {
    //     try {
    //         await pb.collection("users").authWithPassword("test@gmail.com", "12345678");
    //         const token = pb.authStore.token;
    //         const input = document.createElement("input");
    //         input.type = "hidden";
    //         input.name = "token";
    //         input.value = token;
    //         form.appendChild(input);
    //         form.submit();
    //     } catch (e) {
    //         console.error(e);
    //         toast({
    //             message: "Failed to sign in",
    //             type: "error",
    //         });
    //     }
    // }
</script>

<form method="post" bind:this={form} />
<div class="m-auto flex h-screen w-full max-w-lg flex-col justify-center p-4">
    <div class="mb-4">
        <h2 class="mb-2 text-3xl font-semibold">Login to your account</h2>
        <p class="mb-4 mt-2 text-base text-gray-500">
            Login to your account using one of the following providers
        </p>
    </div>
    <div class="flex w-full flex-col gap-4">
        {#each data.methods.authProviders as provider}
            <ProviderButton {provider} {onSignIn} />
        {/each}
    </div>
</div>
