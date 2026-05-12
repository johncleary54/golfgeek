import type { Actions, PageServerLoad } from "./$types";
import { error, fail } from "@sveltejs/kit";
import { getRoundById } from "$lib/server/rounds/round.service";
import {
    createShot,
    getAllShotsByRoundId,
    updateShot,
    type Shot,
    deleteShot,
} from "$lib/server/rounds/shot.service";
import { safe, type Safe } from "$lib/server/safe.service";
import { z } from "zod";
import { formatNumber } from "$lib/utils";
import {
    createHole,
    deleteHole,
    getAllHolesByRoundId,
    updateHole,
} from "$lib/server/rounds/hole.service";
import { ShotClub, ShotLocation } from "$lib/types";

export const load = (async ({ locals, params }) => {
    const roundP = getRoundById(locals.pb, params.roundId);
    const shotsP = getAllShotsByRoundId(locals.pb, locals.user.id, params.roundId);
    const holesP = getAllHolesByRoundId(locals.pb, locals.user.id, params.roundId);

    const [round, shots, holes] = await Promise.all([roundP, shotsP, holesP]);

    if (!round.success) {
        throw error(400, round.error);
    }
    if (!shots.success) {
        throw error(400, shots.error);
    }
    if (!holes.success) {
        throw error(400, holes.error);
    }

    return {
        round: round.data,
        shots: shots.data,
        holes: holes.data,
    };
}) satisfies PageServerLoad;

export const actions = {
    addShot: async ({ locals, request }) => {
        const form = await safe(request.formData());
        if (!form.success) {
            return fail(400, { error: form.error });
        }

        // TODO - make refine on the whole object and check when location is penalty, that all other values are undeifined
        const schema = z
            .object({
                id: z.string(),
                userId: z.string().min(1),
                roundId: z.string().min(1),
                hole: z.number().int().min(1),
                location: z.nativeEnum(ShotLocation),
                distance: z
                    .number()
                    .optional()
                    .refine(
                        (val) => {
                            if (form.data.get("location") === ShotLocation.Green) {
                                return (
                                    val === undefined ||
                                    (typeof val === "number" && val >= 0 && val <= 101)
                                );
                            } else {
                                return (
                                    val === undefined ||
                                    (typeof val === "number" && val > 0 && val < 700)
                                );
                            }
                        },
                        {
                            message:
                                form.data.get("location") === ShotLocation.Green
                                    ? "Distance can't be more than 101 yards on the Green"
                                    : "Distance can't be more than 700 yards",
                        },
                    ),
                club: z.nativeEnum(ShotClub),
                tags: z.string(),
            })
            .safeParse({
                id: form.data.get("id"),
                userId: locals.user.id,
                roundId: form.data.get("roundId"),
                hole: Number(form.data.get("hole")),
                location: form.data.get("location"),
                distance:
                    form.data.get("distance") !== ""
                        ? formatNumber(form.data.get("distance"))
                        : undefined,
                club: form.data.get("club"),
                tags: form.data.getAll("tags").join(","),
            });

        if (!schema.success) {
            console.error(schema.error);
            return fail(400, { form: schema.error.flatten().fieldErrors });
        }

        let shot: Safe<Shot>;
        if (schema.data.id !== "") {
            shot = await updateShot(locals.pb, schema.data.id, schema.data);
        } else {
            shot = await createShot(locals.pb, schema.data);
        }
        if (!shot.success) {
            return fail(400, { error: shot.error });
        }
        // If this is the first shot on the hole, create the hole with par depending on the distance
        if (schema.data.id === "") {
            const shotsByRound = await getAllShotsByRoundId(
                locals.pb,
                locals.user.id,
                schema.data.roundId,
            );
            if (!shotsByRound.success) {
                return fail(400, { error: shotsByRound.error });
            }
            const shotsByHole = shotsByRound.data.filter((s) => s.hole === schema.data.hole);
            if (shotsByHole.length === 1) {
                let par = 4;
                if (schema.data.distance) {
                    if (schema.data.distance <= 250) {
                        par = 3;
                    } else if (schema.data.distance >= 450) {
                        par = 5;
                    }
                }
                const hole = await createHole(locals.pb, {
                    userId: schema.data.userId,
                    roundId: schema.data.roundId,
                    hole: schema.data.hole,
                    par: par,
                });
                if (!hole.success) {
                    return fail(400, { error: hole.error });
                }
            }
        }

        return {
            shot: shot.data,
        };
    },
    deleteShot: async ({ locals, request }) => {
        const form = await safe(request.formData());
        if (!form.success) {
            return fail(400, { error: form.error });
        }

        const schema = z
            .object({
                id: z.string().min(1),
                userId: z.string().min(1),
                roundId: z.string().min(1),
                activeHole: z.number().int().min(1),
                holeId: z.string().min(1),
            })
            .safeParse({
                id: form.data.get("id"),
                userId: locals.user.id,
                roundId: form.data.get("roundId"),
                activeHole: Number(form.data.get("activeHole")),
                holeId: form.data.get("holeId"),
            });

        if (!schema.success) {
            console.error(schema.error);
            return fail(400, { form: schema.error.flatten().fieldErrors });
        }

        const shot = await deleteShot(locals.pb, schema.data.id);
        if (!shot.success) {
            return fail(400, { error: shot.error });
        }

        // If this is the last shot on the hole, delete the hole
        const shotsByRound = await getAllShotsByRoundId(
            locals.pb,
            schema.data.userId,
            schema.data.roundId,
        );
        if (!shotsByRound.success) {
            return fail(400, { error: shotsByRound.error });
        }
        const shotsByHole = shotsByRound.data.filter((s) => s.hole === schema.data.activeHole);
        if (shotsByHole.length === 0) {
            const hole = await deleteHole(locals.pb, schema.data.holeId);
            if (!hole.success) {
                return fail(400, { error: hole.error });
            }
        }

        return {
            shot: shot.data,
        };
    },

    updateHole: async ({ locals, request }) => {
        const start = performance.now();

        const form = await safe(request.formData());
        if (!form.success) {
            return fail(400, { error: form.error });
        }

        const schema = z
            .object({
                id: z.string().min(1),
                par: z.number().int().min(1),
            })
            .safeParse({
                id: form.data.get("id"),
                par: Number(form.data.get("par")),
            });

        if (!schema.success) {
            return fail(400, { form: schema.error.flatten().fieldErrors });
        }

        const hole = await updateHole(locals.pb, schema.data);
        if (!hole.success) {
            return fail(400, { error: hole.error });
        }

        console.debug(`updateHole: ${(performance.now() - start).toFixed(2)}ms`);
        return {
            hole: hole.data,
        };
    },
} satisfies Actions;
