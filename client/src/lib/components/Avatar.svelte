<script lang="ts">
    export let name = "User";
    let imageSrc = `https://www.gravatar.com/avatar/api?name=${name}`;

    export let size: "sm" | "md" | "lg" = "md";
</script>

<div
    class={"select-none items-center justify-center overflow-hidden rounded-full " +
        (size === "sm" ? "h-[32px] w-[32px]" : "") +
        (size === "md" ? "h-[40px] w-[40px]" : "") +
        (size === "lg" ? "h-[48px] w-[48px]" : "")}
>
    <img class="h-full w-full rounded-[inherit] object-cover" src={imageSrc} alt={name} />
</div>
