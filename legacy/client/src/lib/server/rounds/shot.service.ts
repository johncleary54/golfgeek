import type PocketBase from "pocketbase";
import type { Safe } from "../safe.service";
import { ShotClub, ShotLocation } from "$lib/types";

export type Shot = {
    id: string;
    userId: string;
    roundId: string;
    hole: number;
    location: ShotLocation;
    distance: number;
    club: ShotClub;
    tags: string;
    created: string;
    updated: string;
};

function mapShot(shot: Partial<Shot> & { id: string }): Shot {
    return {
        id: shot.id,
        userId: shot.userId ?? "",
        roundId: shot.roundId ?? "",
        hole: shot.hole ?? 0,
        location: shot.location ?? ShotLocation.Unknown,
        distance: shot.distance ?? 0,
        club: shot.club ?? ShotClub.Unknown,
        tags: shot.tags ?? "",
        created: shot.created ?? "",
        updated: shot.updated ?? "",
    };
}

export async function getAllShotsByRoundId(
    pb: PocketBase,
    userId: string,
    roundId: string,
): Promise<Safe<Shot[]>> {
    try {
        const shots: (Partial<Shot> & { id: string })[] = await pb
            .collection("shots")
            .getFullList<Shot>({
                filter: `roundId = "${roundId}" && userId = "${userId}"`,
            });
        const pojo = shots.map(mapShot);
        return { data: pojo, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to load shots", success: false };
    }
}

export async function createShot(
    pb: PocketBase,
    shot: Partial<Shot> & { id: string },
): Promise<Safe<Shot>> {
    try {
        const newShot = await pb.collection("shots").create<Shot>(shot);
        return { data: mapShot(newShot), success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create shot", success: false };
    }
}

export async function updateShot(
    pb: PocketBase,
    id: string,
    shot: Partial<Shot> & { id: string },
): Promise<Safe<Shot>> {
    try {
        const newShot = await pb.collection("shots").update<Shot>(id, shot);
        return { data: mapShot(newShot), success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create shot", success: false };
    }
}

export async function deleteShot(pb: PocketBase, id: string): Promise<Safe<string>> {
    try {
        await pb.collection("shots").delete(id);
        return { data: id, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to delete shot", success: false };
    }
}
