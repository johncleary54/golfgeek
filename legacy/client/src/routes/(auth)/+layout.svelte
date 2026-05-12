<script lang="ts">
    import LogoBlack from "$lib/icons/LogoBlackIcon.svelte";
    import LoginImage from "$lib/assets/login-image.png";
</script>

<section class="grid grid-cols-1 lg:grid-cols-5">
    <div
        class="item-center flex h-screen flex-col justify-between p-8 lg:col-span-2 lg:px-16 lg:py-14"
    >
        <LogoBlack />
        <slot />
        <span />
    </div>
    <div class="relative hidden h-screen p-4 lg:col-span-3 lg:block">
        <img src={LoginImage} alt="" class="h-full w-full rounded-lg object-cover object-top" />
    </div>
</section>
