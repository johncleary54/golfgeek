<script lang="ts">
    import { page } from "$app/stores";
    import Avatar from "$lib/components/Avatar.svelte";
    import Dropdown from "$lib/components/form/Dropdown.svelte";
    import type { LayoutData } from "./$types";
    import LogoBlack from "$lib/icons/LogoBlackIcon.svelte";
    import LogoWhite from "$lib/icons/LogoWhiteIcon.svelte";
    import GlobalFilter from "./global-filter/GlobalFilter.svelte";
    import { setContext } from "svelte";

    export let data: LayoutData;

    $: currPage = $page.url.pathname.split("/")[1] ?? "";

    // ** Context to access courses in GeneralFilter.svelte
    setContext("courses", data.courses);

    function onLogout(): void {
        window.location.href = "/auth";
    }

    const navigationItems = [
        {
            label: "Analysis",
            path: `/analysis${$page.url.search || ""}`,
        },
        {
            label: "Predictor",
            path: `/predictor/off-the-tee${$page.url.search || ""}`,
        },
        { label: "Rounds", path: "/rounds" },
    ];
</script>

<div class="flex h-screen flex-col">
    <nav class="flex justify-center bg-neutral-900">
        <div class="mx-auto flex w-full max-w-screen-2xl justify-between px-6 py-[18px]">
            <div class="flex items-center overflow-auto">
                <a href="/analysis" class="mr-6 lg:mr-14">
                    <LogoWhite />
                </a>

                {#if data.subscribed}
                    <div class="hidden grid-cols-3 justify-center gap-2 text-white lg:grid">
                        {#each navigationItems as item}
                            <a
                                href={item.path}
                                class="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-neutral-800/60
                            {item.path.includes(currPage) ? 'bg-neutral-800/60' : ''}"
                            >
                                <span
                                    class={item.path.includes(currPage)
                                        ? "bg-secondary-500 inline-block h-2 w-2 rounded-full transition-all duration-300 ease-in-out"
                                        : "inline-block h-2 w-2 rounded-full bg-transparent"}
                                />
                                {item.label}
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="flex items-center justify-center">
                <div class="mr-4 flex gap-2 lg:mr-10">
                    <div class="p-2.5 lg:hidden">
                        {#if data.subscribed}
                            <Dropdown>
                                <svelte:fragment slot="button">
                                    <div
                                        class="hover:text-secondary-500 transition hover:cursor-pointer"
                                    >
                                        <svg
                                            class="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="white"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M4 6h16M4 12h16m-7 6h7"
                                            />
                                        </svg>
                                    </div>
                                </svelte:fragment>
                                <svelte:fragment slot="dropdown">
                                    <div class="flex min-w-[120px] flex-col bg-white p-4">
                                        <div class="flex w-full flex-col gap-2">
                                            {#each navigationItems as item}
                                                <a
                                                    href={item.path}
                                                    class="hover:text-secondary-500 transition"
                                                >
                                                    {item.label}
                                                </a>
                                            {/each}
                                        </div>
                                    </div>
                                </svelte:fragment>
                            </Dropdown>
                        {/if}
                    </div>

                    <!-- Only show on analysis and predictor pages -->
                    {#if currPage.includes("analysis") || currPage.includes("predictor")}
                        <GlobalFilter />
                    {/if}
                </div>
                <Dropdown>
                    <svelte:fragment slot="button">
                        <div class="hover:text-secondary-500 transition hover:cursor-pointer">
                            <Avatar size="md" name="User" />
                        </div>
                    </svelte:fragment>
                    <svelte:fragment slot="dropdown">
                        <div class="flex min-w-[120px] flex-col bg-white p-4">
                            <div class="w-full border-b border-gray-100 pb-3 font-medium">
                                {data.email}
                            </div>

                            <div class="flex w-full flex-col gap-2 border-b border-gray-100 py-3">
                                <a href="/billing" class="hover:text-secondary-500 transition">
                                    Billing
                                </a>
                            </div>

                            <button
                                on:click={onLogout}
                                class="hover:text-secondary-500 w-full pt-3 text-left transition"
                            >
                                Sign out
                            </button>
                        </div>
                    </svelte:fragment>
                </Dropdown>
            </div>
        </div>
    </nav>
    <section class="flex-1">
        <div class="relative mx-auto">
            <slot />
        </div>
    </section>
    <footer
        class="shadow-card flex h-20 items-center justify-center border-t border-neutral-100 bg-white"
    >
        <div class="mx-auto flex w-full max-w-screen-2xl justify-between px-6 py-8">
            <div class="flex items-center pr-2">
                <a href="/analysis" class="mr-6 lg:mr-14">
                    <LogoBlack />
                </a>
            </div>
            <div>
                <p class="text-right text-sm text-neutral-300">
                    2023 Golfgeek Ltd. All rights reserved
                </p>
            </div>
        </div>
    </footer>
</div>
