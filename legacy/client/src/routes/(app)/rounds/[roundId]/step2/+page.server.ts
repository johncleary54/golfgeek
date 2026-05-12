import z from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { getRoundById, updateRound } from "$lib/server/rounds/round.service";
import {
    Firmness,
    Height,
    Precipitation,
    Smoothness,
    Speed,
    Temperature,
    Wind,
} from "$lib/server/rounds/details.enums";

export const load = (async ({ locals, params }) => {
    const round = await getRoundById(locals.pb, params.roundId);
    if (!round.success) {
        throw error(400, round.error);
    }
    return {
        round: round.data,
    };
}) satisfies PageServerLoad;

export const actions = {
    editConditions: async ({ locals, request }) => {
        const form = await request.formData();

        const roundId = form.get("roundId");
        const temperature = form.get("temperature") === "" ? undefined : form.get("temperature");
        const wind = form.get("wind") === "" ? undefined : form.get("wind");
        const precipitation =
            form.get("precipitation") === "" ? undefined : form.get("precipitation");
        const firmness = form.get("firmness") === "" ? undefined : form.get("firmness");
        const height = form.get("height") === "" ? undefined : form.get("height");
        const smoothness = form.get("smoothness") === "" ? undefined : form.get("smoothness");
        const speed = form.get("speed") === "" ? undefined : form.get("speed");

        const schema = z
            .object({
                roundId: z.string().min(1),
                temperature: z.nativeEnum(Temperature).optional(),
                wind: z.nativeEnum(Wind).optional(),
                precipitation: z.nativeEnum(Precipitation).optional(),
                firmness: z.nativeEnum(Firmness).optional(),
                height: z.nativeEnum(Height).optional(),
                smoothness: z.nativeEnum(Smoothness).optional(),
                speed: z.nativeEnum(Speed).optional(),
            })
            .safeParse({
                roundId,
                temperature,
                wind,
                precipitation,
                firmness,
                height,
                smoothness,
                speed,
            });
        if (!schema.success) {
            console.error(schema.error.flatten());
            return fail(400, { form: schema.error.flatten().fieldErrors });
        }

        const round = await updateRound(locals.pb, {
            id: schema.data.roundId,
            temperature: schema.data.temperature,
            wind: schema.data.wind,
            precipitation: schema.data.precipitation,
            firmness: schema.data.firmness,
            height: schema.data.height,
            smoothness: schema.data.smoothness,
            speed: schema.data.speed,
        });

        if (!round.success) {
            return fail(400, { error: round.error });
        }

        throw redirect(303, `/rounds/${round.data.id}/step3`);
    },
} satisfies Actions;
