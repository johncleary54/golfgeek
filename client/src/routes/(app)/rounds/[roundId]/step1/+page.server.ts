import { createCourse, getAllCoursesByUserId } from "$lib/server/rounds/course.service";
import z from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { getRoundById, updateRound } from "$lib/server/rounds/round.service";

export const load = (async ({ locals, params }) => {
    const round = await getRoundById(locals.pb, params.roundId);
    if (!round.success) {
        throw error(400, round.error);
    }
    const courses = await getAllCoursesByUserId(locals.pb, locals.user.id);
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
    return {
        round: round.data,
        courses: courses,
        courseName: courseName,
    };
}) satisfies PageServerLoad;

export const actions = {
    addCourse: async ({ locals, request }) => {
        const form = await request.formData();

        const schema = z
            .object({
                roundId: z.string().min(1),
                name: z.string().min(1),
            })
            .safeParse({
                roundId: form.get("roundId"),
                name: form.get("name"),
            });

        if (!schema.success) {
            console.error(schema.error.flatten());
            return fail(400, { form: schema.error.flatten().fieldErrors });
        }

        // if course already exists, return error
        const courses = await getAllCoursesByUserId(locals.pb, locals.user.id);
        if (!courses.success) {
            return fail(400, { error: courses.error });
        }

        const courseExists = courses.data.find((el) => el.name === schema.data.name);
        if (courseExists !== undefined) {
            console.error("Course already exists");
            return fail(400, { error: "Course already exists" });
        }

        const course = await createCourse(locals.pb, locals.user.id, schema.data.name);

        if (!course.success) {
            return fail(400, { error: course.error });
        }

        const round = {
            id: schema.data.roundId,
            courseId: course.data.id,
        };
        const resp = await updateRound(locals.pb, round);
        if (!resp.success) {
            return fail(400, { error: resp.error });
        }

        return { course: course.data };
    },
    editRoundDetails: async ({ locals, request }) => {
        const form = await request.formData();
        const roundId = form.get("roundId");
        const courseId = form.get("courseId");
        const date = form.get("date");
        const teeTime = form.get("teeTime");
        const type = form.get("type");

        const schema = z
            .object({
                roundId: z.string().min(1),
                courseId: z.string().min(1),
                type: z.string().min(1),
                date: z.string().min(1),
                teeTime: z.string(),
            })
            .safeParse({ roundId, courseId, date, teeTime, type });

        if (!schema.success) {
            console.error(schema.error.flatten());
            return fail(400, { form: schema.error.flatten().fieldErrors });
        }

        const round = {
            id: schema.data.roundId,
            courseId: schema.data.courseId,
            date: schema.data.date,
            teeTime: schema.data.teeTime,
            type: schema.data.type,
        };

        const response = await updateRound(locals.pb, round);
        if (!response.success) {
            return fail(400, { error: response.error });
        }
        throw redirect(303, `/rounds/${round.id}/step2`);
    },
} satisfies Actions;
