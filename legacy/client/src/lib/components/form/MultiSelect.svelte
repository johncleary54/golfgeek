<script lang="ts">
    let open = false;

    type Option = {
        id: number;
        label: string;
        checked: boolean;
    };

    let options: Option[] = [
        { id: 1, label: "Option 1", checked: false },
        { id: 2, label: "Option 2", checked: false },
        { id: 3, label: "Option 3", checked: false },
        { id: 4, label: "Option 4", checked: false },
        { id: 5, label: "Option 5", checked: false },
        { id: 6, label: "Option 6", checked: false },
        { id: 7, label: "Option 7", checked: false },
        { id: 8, label: "Option 8", checked: false },
        { id: 9, label: "Option 9", checked: false },
        { id: 10, label: "Option 10", checked: false },
    ];

    let selectedOptions: Option[] = [];

    function useClickOutside(node: HTMLElement): { destroy: () => void } {
        const handleClick = (event: MouseEvent): void => {
            if (!node.contains(event.target as Node)) {
                open = false;
            }
        };
        document.addEventListener("click", handleClick);
        return {
            destroy() {
                document.removeEventListener("click", handleClick);
            },
        };
    }

    function toggleOption(option: Option): void {
        if (option.checked) {
            selectedOptions = [...selectedOptions, option];
        } else {
            selectedOptions = selectedOptions.filter((o) => o.id !== option.id);
        }
    }

    $: inputValue = selectedOptions.map((o) => o.label).join(", ");
</script>

<div class="relative" use:useClickOutside>
    <input
        class="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
        type="text"
        readonly
        value={inputValue}
        placeholder="Select options"
        on:click={() => {
            open = !open;
        }}
    />
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    </div>

    {#if open}
        <div
            class="absolute left-0 z-10 mt-2 w-full overflow-hidden whitespace-nowrap rounded-lg border border-neutral-100 bg-white shadow-card"
        >
            {#each options as option (option.id)}
                <label class="flex items-center justify-between px-4 py-2">
                    <span>{option.label}</span>
                    <input
                        type="checkbox"
                        class="h-5 w-5 cursor-pointer"
                        bind:checked={option.checked}
                        on:change={() => toggleOption(option)}
                    />
                </label>
            {/each}
        </div>
    {/if}
</div>

<div class="mt-2 flex flex-wrap">
    {#each selectedOptions as option (option.id)}
        <div class="m-1 flex items-center rounded-md bg-neutral-75 px-2 py-1 text-neutral-800">
            <span class=" mr-1 text-sm font-medium">
                {option.label}
            </span>
        </div>
    {/each}
</div>
