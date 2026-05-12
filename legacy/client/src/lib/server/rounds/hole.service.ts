import type PocketBase from "pocketbase";
import type { Safe } from "../safe.service";

export type Hole = {
    id: string;
    userId: string;
    roundId: string;
    hole: number;
    par: number;
    created: string;
    updated: string;
};

function mapHole(hole: Partial<Hole> & { id: string }): Hole {
    return {
        id: hole.id,
        userId: hole.userId ?? "",
        roundId: hole.roundId ?? "",
        hole: hole.hole ?? 0,
        par: hole.par ?? 0,
        created: hole.created ?? "",
        updated: hole.updated ?? "",
    };
}
export async function getAllHolesByRoundId(
    pb: PocketBase,
    userId: string,
    roundId: string,
): Promise<Safe<Hole[]>> {
    try {
        const holes: (Partial<Hole> & { id: string })[] = await pb
            .collection("holes")
            .getFullList<Hole>({
                filter: `roundId = "${roundId}" && userId = "${userId}"`,
            });
        const pojo = holes.map(mapHole);
        return { data: pojo, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to load holes", success: false };
    }
}

export async function createHole(
    pb: PocketBase,
    hole: Omit<Hole, "id" | "created" | "updated">,
): Promise<Safe<Hole>> {
    try {
        const data = await pb.collection("holes").create<Hole>(hole);
        return { data: mapHole(data), success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create hole", success: false };
    }
}

export async function updateHole(
    pb: PocketBase,
    hole: Partial<Hole> & { id: string },
): Promise<Safe<Hole>> {
    try {
        const data = await pb.collection("holes").update<Hole>(hole.id, hole);
        return { data: mapHole(data), success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to update hole", success: false };
    }
}

export async function deleteHole(pb: PocketBase, holeId: string): Promise<Safe<string>> {
    try {
        await pb.collection("holes").delete(holeId);
        return { data: holeId, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to delete hole", success: false };
    }
}
