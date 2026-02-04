<script lang="ts">
    import { page } from "$app/stores";

    const error = $page.error?.message ?? "Something went wrong";
    console.error($page.error);
</script>

<h1>{error}</h1>
