import type PocketBase from "pocketbase";
import type { Safe } from "../safe.service";

export type Round = {
    id: string;
    userId: string;
    courseId: string;
    type: string;
    date: string;
    teeTime: string;
    temperature: string;
    wind: string;
    precipitation: string;
    firmness: string;
    height: string;
    smoothness: string;
    speed: string;
    created: string;
    updated: string;
};

export function mapRound(round: Partial<Round> & { id: string }): Round {
    return {
        id: round.id,
        userId: round.userId ?? "",
        courseId: round.courseId ?? "",
        type: round.type ?? "",
        date: round.date ?? "",
        teeTime: round.teeTime ?? "",
        temperature: round.temperature ?? "",
        wind: round.wind ?? "",
        precipitation: round.precipitation ?? "",
        firmness: round.firmness ?? "",
        height: round.height ?? "",
        smoothness: round.smoothness ?? "",
        speed: round.speed ?? "",
        created: round.created ?? "",
        updated: round.updated ?? "",
    };
}

export async function getAllRoundsByUserId(
    pb: PocketBase,
    userId: string,
): Promise<Safe<Round[]>> {
    try {
        const rounds: (Partial<Round> & { id: string })[] = await pb
            .collection("rounds")
            .getFullList<Round>({
                filter: `userId = "${userId}"`,
            });
        const pojo = rounds.map((round) => mapRound(round));
        return { data: pojo, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to load rounds", success: false };
    }
}

export async function getRoundById(pb: PocketBase, id: string): Promise<Safe<Round>> {
    try {
        const round = await pb.collection("rounds").getOne<Round>(id);
        const pojo = mapRound(round);
        return { data: pojo, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to load round", success: false };
    }
}

export async function createRound(pb: PocketBase, userId: string): Promise<Safe<Round>> {
    try {
        const round = await pb.collection("rounds").create<Round>({
            userId: userId,
        });
        return { data: round, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create round", success: false };
    }
}

export async function updateRound(
    pb: PocketBase,
    round: Partial<Round> & { id: string },
): Promise<Safe<Round>> {
    try {
        const updatedRound = await pb.collection("rounds").update<Round>(round.id, round);
        return { data: updatedRound, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to update round", success: false };
    }
}

export async function deleteRound(pb: PocketBase, id: string): Promise<Safe<string>> {
    try {
        await pb.collection("rounds").delete(id);
        return { data: id, success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to delete round", success: false };
    }
}

export async function getAllRoundsByDate(
    pb: PocketBase,
    userId: string,
    fromDate: string | null,
    toDate: string | null,
): Promise<Safe<Round[]>> {
    try {
        let filter = `userId = "${userId}"`;

        if (fromDate && toDate) {
            filter += ` && date >= "${fromDate}" && date <= "${toDate}"`;
        }

        if (fromDate && !toDate) {
            filter += ` && date >= "${fromDate}"`;
        }

        if (toDate && !fromDate) {
            filter += ` && date <= "${toDate}"`;
        }

        const rounds: (Partial<Round> & { id: string })[] = await pb
            .collection("rounds")
            .getFullList<Round>({
                filter,
            });

        const pojo = rounds.map((round) => mapRound(round));
        return { data: pojo, success: true };
    } catch (e) {
        console.error(e);
        return {
            error: `Failed to load rounds for date range`,
            success: false,
        };
    }
}
