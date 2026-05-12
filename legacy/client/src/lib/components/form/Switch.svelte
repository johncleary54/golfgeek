<script lang="ts">
    export let label = "";

    export let value = "on";

    let checked = true;

    const randID = Math.floor(Math.random() * 100);

    function handleClick(): void {
        checked = !checked;
        value = checked ? "on" : "off";
    }
</script>

<div class="flex items-center">
    <span id="switch-{randID}" class="mr-2">{label}</span>
    <button
        role="switch"
        aria-checked={checked}
        aria-labelledby={`switch-${randID}`}
        class="relative inline-flex h-6 w-12 items-center rounded-full bg-neutral-75 focus:outline-none"
        class:bg-primary-500={checked}
        class:ml-2={label}
        on:click={handleClick}
    >
        <span class="sr-only">Toggle</span>
        <span
            class="{checked
                ? 'translate-x-[1.60rem]'
                : 'translate-x-[0.15rem]'} inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"
        />
    </button>
</div>
