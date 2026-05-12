<script lang="ts">
    export let value: string;
    export let name: string;
    export let type: "email" | "text" | "password" | "date" | "time" | "number" = "text";
    export let label = "";
    export let placeholder = "";
    export let errors: string[] = [];
    export let disabled = false;

    $: haveErrors = errors.length > 0;
    function typeAction(node: HTMLInputElement): void {
        node.type = type;
    }
</script>

<div class="flex w-full flex-col">
    {#if label}
        <label class="pb-1 text-sm text-neutral-600" for={name}>
            {label}
        </label>
    {/if}
    <div class="relative">
        <input
            {name}
            use:typeAction
            {placeholder}
            bind:value
            class={"focus:ring-primary-400 h-12 w-full rounded-lg border border-neutral-100 bg-white px-4 py-2 text-sm shadow placeholder:text-sm focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 " +
                (haveErrors ? "ring-error-500 ring-1 " : "") +
                ($$slots.icon ? "pl-12" : "")}
            {disabled}
            min="0"
            on:keypress={(e) => {
                if (type === "number") {
                    if (e.key === "." && value.includes(".")) {
                        e.preventDefault();
                    }
                }
            }}
        />
        <div class="absolute left-0 top-0 flex h-full items-center pl-4 pr-4 text-neutral-900">
            <slot name="icon" />
        </div>
    </div>

    <p class="text-error-500 h-6 pt-1 text-sm">
        {haveErrors ? errors[0] : ""}
    </p>
</div>
