<script lang="ts">
    let className: string | undefined = undefined;
    export { className as class };
</script>

<div class="flex flex-col space-y-2 text-center sm:text-left {className}" {...$$restProps}>
    <slot />
</div>
