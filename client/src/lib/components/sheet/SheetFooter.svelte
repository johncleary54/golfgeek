<script lang="ts">
    let className: string | undefined = undefined;
    export { className as class };
</script>

<div
    class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 {className}"
    {...$$restProps}
>
    <slot />
</div>
