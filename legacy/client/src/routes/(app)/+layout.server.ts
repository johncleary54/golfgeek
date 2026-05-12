import { getAllCoursesByUserId } from "$lib/server/rounds/course.service";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import {
    getAllRoundsByDate,
    getAllRoundsByUserId,
    type Round,
} from "$lib/server/rounds/round.service";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { Safe } from "$lib/server/safe.service";
import { getAllShotsByRoundId } from "$lib/server/rounds/shot.service";
import { getAllHolesByRoundId } from "$lib/server/rounds/hole.service";
dayjs.extend(customParseFormat);

export const load: LayoutServerLoad = (async ({ locals, url }) => {
    const {
        pb,
        user: { id, email },
    } = locals;

    const courses = await getAllCoursesByUserId(pb, id);
    if (!courses.success) {
        throw error(400, courses.error);
    }

    const params = url.searchParams;
    let fromDate = params.get("fromDate");
    let toDate = params.get("toDate");

    if (fromDate || toDate) {
        fromDate = fromDate ? dayjs(fromDate).format() : null;
        toDate = toDate ? dayjs(toDate).format() : null;

        const isValidFromDate = dayjs(fromDate).isValid();
        const isValidToDate = dayjs(toDate).isValid();

        if (fromDate && !isValidFromDate) {
            throw error(400, "Invalid fromDate");
        }
        if (toDate && !isValidToDate) {
            throw error(400, "Invalid toDate");
        }
    }
    let filteredResponse: Safe<Round[]>;
    if (fromDate || toDate) {
        filteredResponse = await getAllRoundsByDate(pb, id, fromDate, toDate);
    } else {
        filteredResponse = await getAllRoundsByUserId(pb, id);
    }

    if (!filteredResponse.success) {
        throw error(500, "Failed to fetch rounds");
    }

    const filterProperties = {
        courseId: "courseId",
        teeTime: "teeTime",
        roundType: "type",
        temperature: "temperature",
        wind: "wind",
        precipitation: "precipitation",
        height: "height",
        smoothness: "smoothness",
        speed: "speed",
        score: "score",
        quickAction: "quickAction",
    };

    const filters: Record<string, string> = {};
    for (const [queryKey, roundKey] of Object.entries(filterProperties)) {
        const value = params.get(queryKey);
        if (value) {
            filters[roundKey] = value;
        }
    }

    /**
     * Filter rounds by query params
     * If there are no query params, return last 10 rounds
     */
    let filteredRounds: Round[];
    if (Object.keys(filters).length > 0 || fromDate || toDate) {
        filteredRounds = filteredResponse.data.filter((round) =>
            Object.entries(filters).every(
                ([roundKey, value]) => round[roundKey as keyof typeof round] === value,
            ),
        );
    } else {
        filteredRounds = filteredResponse.data.slice(0, 10);
    }

    // ** Fetch shots and holes for filtered rounds or last 10 rounds **
    // TODO - we can make it with one request
    // https://github.com/pocketbase/pocketbase/discussions/2463
    const fetchPromises = filteredRounds.map((round) => {
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

    const roundsAmount = filteredRounds.length;

    return {
        userId: id,
        subscribed: locals.user.subscribed,
        email,
        courses: courses.data,
        filteredRounds,
        shotsForRounds,
        holesForRounds,
        roundsAmount,
    };
}) satisfies LayoutServerLoad;
