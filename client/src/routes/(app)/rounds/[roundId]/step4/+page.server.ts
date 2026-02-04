import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getRoundById } from "$lib/server/rounds/round.service";
import { getAllShotsByRoundId } from "$lib/server/rounds/shot.service";
import { getAllHolesByRoundId } from "$lib/server/rounds/hole.service";
import { getAllCoursesByUserId } from "$lib/server/rounds/course.service";
import { Calculator } from "$lib/server/calculator/MainCalculator";

export const load = (async ({ locals, params }) => {
    const roundP = getRoundById(locals.pb, params.roundId);
    const coursesP = getAllCoursesByUserId(locals.pb, locals.user.id);
    const shotsP = getAllShotsByRoundId(locals.pb, locals.user.id, params.roundId);
    const holesP = getAllHolesByRoundId(locals.pb, locals.user.id, params.roundId);

    const [round, courses, shots, holes] = await Promise.all([roundP, coursesP, shotsP, holesP]);

    if (!round.success) {
        throw error(400, round.error);
    }
    if (!shots.success) {
        throw error(400, shots.error);
    }
    if (!holes.success) {
        throw error(400, holes.error);
    }
    if (!courses.success) {
        throw error(400, courses.error);
    }

    let courseName = "";
    if (round.data.courseId !== "") {
        const course = courses.data.find((el) => el.id === round.data.courseId);
        if (course !== undefined) {
            courseName = course.name;
        }
    }

    const calculator = new Calculator([round.data], [shots.data], [holes.data]);
    const review = calculator.calcReview();

    return {
        round: round.data,
        courseName: courseName,
        totalPar: review.totalPar,
        totalScore: review.totalScore,
    };
}) satisfies PageServerLoad;
