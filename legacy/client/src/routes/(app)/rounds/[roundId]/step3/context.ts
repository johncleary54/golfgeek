import type { Writable } from "svelte/store";
import type { ActionData, PageData } from "./$types";
import type { ShotLocation } from "$lib/types";

export type Context = {
    data: Writable<PageData>;
    form: Writable<ActionData>;
    shotForm: Writable<{
        id: string;
        shotNumber: string;
        location: ShotLocation;
        distance: string;
        club: string;
        tags: string;
    }>;

    isEditing: Writable<boolean>;

    activeHole: Writable<number>;
};
