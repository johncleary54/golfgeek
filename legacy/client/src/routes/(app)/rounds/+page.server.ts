import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { safe } from "$lib/server/safe.service";
import { z } from "zod";
import { getAllCoursesByUserId } from "$lib/server/rounds/course.service";
import { getAllShotsByRoundId } from "$lib/server/rounds/shot.service";
import { getAllHolesByRoundId } from "$lib/server/rounds/hole.service";
import { Calculator } from "$lib/server/calculator/MainCalculator";
import { createRound, deleteRound, getAllRoundsByUserId } from "$lib/server/rounds/round.service";
import dayjs from "dayjs";

export type RoundData = {
    id: string;
    courseName: string;
    score: number;
    date: string;
    holes: number;
    putt: number;
    arg: number;
    app: number;
    ott: number;
    total: number;
};

export const load: PageServerLoad = async ({ locals }) => {
    const rounds = await getAllRoundsByUserId(locals.pb, locals.user.id);
    if (!rounds.success) {
        console.error(rounds.error);
        throw error(500, "Failed to load rounds");
    }

    const courses = await getAllCoursesByUserId(locals.pb, locals.user.id);
    if (!courses.success) {
        console.error(courses.error);
        throw error(500, "Failed to load courses");
    }

    const fetchPromises = rounds.data.map((round) => {
        const shotsPromise = getAllShotsByRoundId(locals.pb, locals.user.id, round.id);
        const holesPromise = getAllHolesByRoundId(locals.pb, locals.user.id, round.id);
        return Promise.all([shotsPromise, holesPromise]);
    });

    const fetchedData = await Promise.all(fetchPromises);

    // ** Extract shots and holes data for each round
    const shotsForRounds = fetchedData.map(([shots]) => {
        if (!shots.success) {
            throw error(500, shots.error);
        }
        return shots.data;
    });

    const holesForRounds = fetchedData.map(([, holes]) => {
        if (!holes.success) {
            throw error(500, holes.error);
        }
        return holes.data;
    });

    const calculator = new Calculator(rounds.data, shotsForRounds, holesForRounds);

    const roundsCalculations = calculator.calcRounds();

    const roundData: RoundData[] = roundsCalculations
        .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
        .map((round) => {
            const actualRound = rounds.data.find((r) => r.id === round.id);
            if (!actualRound) {
                throw error(500, "Failed to find round");
            }

            const course = courses.data.find((c) => c.id === actualRound.courseId);

            return {
                id: round.id,
                courseName: course?.name ?? "Unknown",
                score: round.score,
                date: round.date,
                holes: round.holes,
                putt: round.putt,
                arg: round.arg,
                app: round.app,
                ott: round.ott,
                total: round.total,
            };
        });

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const roundsPlayedThisMonth = roundData.filter((round) => {
        const roundDate = new Date(round.date);
        const roundMonth = roundDate.getMonth();
        const roundYear = roundDate.getFullYear();

        return roundMonth === thisMonth && roundYear === thisYear;
    });

    let bestScoreThisMonth = 0;

    if (roundsPlayedThisMonth.length > 0) {
        bestScoreThisMonth = Math.min(...roundsPlayedThisMonth.map((round) => round.score));
    }

    return {
        rounds: roundData,
        roundsPlayedThisMonth,
        bestScoreThisMonth,
    };
};

export const actions: Actions = {
    newRound: async ({ locals }) => {
        const pb = locals.pb;
        const round = await createRound(pb, locals.user.id);
        if (!round.success) {
            throw fail(400, { error: round.error });
        }
        const roundId = round.data.id;
        throw redirect(303, `/rounds/${roundId}/step1`);
    },

    deleteRound: async ({ locals, request }) => {
        const form = await safe(request.formData());

        if (!form.success) {
            return fail(400, { error: form.error });
        }

        const schema = z.object({
            roundId: z.string().min(1),
        });

        const validationResult = schema.safeParse({
            roundId: form.data.get("roundId"),
        });

        if (!validationResult.success) {
            console.error(validationResult.error);
            return fail(400, { error: "Invalid data" });
        }

        const { roundId } = validationResult.data;

        const round = await deleteRound(locals.pb, roundId);
        if (!round.success) {
            return fail(400, { error: round.error });
        }
        return {
            status: 200,
        };
    },
};
