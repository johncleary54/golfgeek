import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import { ShotLocation, type BaselineData } from "$lib/types";
import baselineData from "../../../data/baseline.json";
import type { Shot } from "../rounds/shot.service";

type BaselineValues = Pick<Shot, "location" | "distance">;

export type ShotStrokesGained = Shot & { par: number; strokesGained: number };

type StrokesGainedReturn = {
    totalStrokesGained: number;
    totalStrokesGainedOffTheTee: number;
    offTheTeeShots: ShotStrokesGained[];
    totalStrokesGainedApproach: number;
    approachShots: ShotStrokesGained[];
    totalStrokesGainedShortGame: number;
    shortGameShots: ShotStrokesGained[];
    totalStrokesGainedPutting: number;
    putts: ShotStrokesGained[];
};
export class StrokesGainedCalculator {
    round: Round;
    shots: Shot[];
    holes: Hole[];

    constructor(round: Round, shots: Shot[], holes: Hole[]) {
        this.round = round;
        this.shots = shots;
        this.holes = holes;

        const mismatchedShots = shots.filter((shot) => shot.roundId !== round.id);
        const mismatchedHoles = holes.filter((hole) => hole.roundId !== round.id);

        if (mismatchedShots.length > 0 || mismatchedHoles.length > 0) {
            throw new Error("Holes and shots must be from the same round");
        }
    }

    isApproachShot({
        location,
        distance,
        par,
    }: {
        location: ShotLocation;
        distance: number;
        par: number;
    }): boolean {
        if (location === ShotLocation.Penalty) {
            return false;
        }
        // If the location of the shot is not 'green', the shot distance is great than 100 yards,
        // and it's not a tee shot on a par 4 or 5, it is an approach shot, so return true
        if (
            location !== ShotLocation.Green &&
            distance > 100 &&
            !(location === ShotLocation.Tee && (par === 4 || par === 5))
        ) {
            return true;
        }

        return false;
    }

    isShortGameShot({
        location,
        distance,
        par,
    }: {
        location: ShotLocation;
        distance: number;
        par: number;
    }): boolean {
        if (location === ShotLocation.Penalty) {
            return false;
        }
        // If the location of the shot is not 'green', the shot distance is great than 100 yards,
        // and it's not a tee shot on a par 4 or 5, it is an approach shot, so return true
        if (
            location !== ShotLocation.Green &&
            distance <= 100 &&
            !(location === ShotLocation.Tee && (par === 4 || par === 5))
        ) {
            return true;
        }

        return false;
    }

    isOTTShot({ location, par }: { location: ShotLocation; par: number }): boolean {
        if (location === ShotLocation.Penalty) {
            return false;
        }

        if (location === ShotLocation.Tee && (par === 4 || par === 5)) {
            return true;
        }

        return false;
    }

    // ** This gets the baseline value from the baseline.json file
    // * (which is a JSON version of the data from the PGA Tour basline.xlsx file provided by john)
    calcBaselineValue({ location, distance }: BaselineValues): number {
        const baselineFeet = baselineData.find(
            (b: BaselineData) => b.location === location && b.distanceFeet === distance,
        ) as BaselineData;

        const baselineYards = baselineData.find(
            (b: BaselineData) => b.location === location && b.distanceYards === distance,
        ) as BaselineData;

        // The distance value is inputted by the user in feet for the green (Putts),
        // so we need check against feet instead of yds if the location is on the green
        return location === ShotLocation.Green ? baselineFeet.baseline : baselineYards.baseline;
    }

    // ** This calculates the strokes gained for a single shot, if the next shot is not provided
    // * then it assumes that this is the last shot of the hole
    calcStrokesGainedPerShot(shot: Shot, nextShot?: Shot, nextNextShot?: Shot): number {
        if (shot.location === ShotLocation.Penalty) {
            return 0;
        }

        const baselineCurrentShot = this.calcBaselineValue({
            location: shot.location,
            distance: shot.distance,
        });

        // If there is no next shot, then this is the last shot of the hole
        if (!nextShot) {
            return baselineCurrentShot - 1;
        }

        // If the next shot is a penalty, then the baseline value is 2 less than the current shot
        if (nextShot.location === ShotLocation.Penalty) {
            if (nextNextShot?.location) {
                return (
                    baselineCurrentShot -
                    this.calcBaselineValue({
                        location: nextNextShot.location,
                        distance: nextNextShot.distance,
                    }) -
                    2
                );
            } else {
                return baselineCurrentShot - 1 - 2;
            }
        }

        return (
            baselineCurrentShot -
            this.calcBaselineValue({
                location: nextShot.location,
                distance: nextShot.distance,
            }) -
            1
        );
    }

    // ** This is the main function that calculates the strokes gained for the round
    // * It includes the total strokes gained for the round, as well as the strokes gained for each category
    calcStrokesGainedPerRound(): StrokesGainedReturn {
        let totalStrokesGained = 0;
        let totalStrokesGainedOffTheTee = 0;
        let totalStrokesGainedApproach = 0;
        let totalStrokesGainedShortGame = 0;
        let totalStrokesGainedPutting = 0;
        const offTheTeeShots: ShotStrokesGained[] = [];
        const approachShots: ShotStrokesGained[] = [];
        const shortGameShots: ShotStrokesGained[] = [];
        const putts: ShotStrokesGained[] = [];

        this.holes.forEach((hole) => {
            const holeShots = this.shots.filter((shot) => shot.hole === hole.hole);

            for (let i = 0; i < holeShots.length; i++) {
                const shot = holeShots[i];
                if (shot === undefined) {
                    continue;
                }

                const nextShot = holeShots[i + 1];
                const nextNextShot = holeShots[i + 2];

                const strokesGainedPerShot = this.calcStrokesGainedPerShot(
                    shot,
                    nextShot,
                    nextNextShot,
                );

                totalStrokesGained += strokesGainedPerShot;

                // ** OTT
                if (
                    this.isOTTShot({
                        location: shot.location,
                        par: hole.par,
                    })
                ) {
                    totalStrokesGainedOffTheTee += strokesGainedPerShot;
                    offTheTeeShots.push({
                        ...shot,
                        par: hole.par,
                        strokesGained: +strokesGainedPerShot.toFixed(2),
                    });
                }
                // APPROACH
                if (
                    this.isApproachShot({
                        location: shot.location,
                        distance: shot.distance,
                        par: hole.par,
                    })
                ) {
                    totalStrokesGainedApproach += strokesGainedPerShot;
                    approachShots.push({
                        ...shot,
                        par: hole.par,
                        strokesGained: +strokesGainedPerShot.toFixed(2),
                    });
                }
                // SHORT GAME
                if (
                    this.isShortGameShot({
                        location: shot.location,
                        distance: shot.distance,
                        par: hole.par,
                    })
                ) {
                    totalStrokesGainedShortGame += strokesGainedPerShot;
                    shortGameShots.push({
                        ...shot,
                        par: hole.par,
                        strokesGained: +strokesGainedPerShot.toFixed(2),
                    });
                }
                // PUTTING
                if (
                    shot.location !== ShotLocation.Penalty &&
                    shot.location === ShotLocation.Green
                ) {
                    totalStrokesGainedPutting += strokesGainedPerShot;
                    putts.push({
                        ...shot,
                        par: hole.par,
                        strokesGained: +strokesGainedPerShot.toFixed(2),
                    });
                }

                totalStrokesGained = Number(totalStrokesGained.toFixed(2));
                totalStrokesGainedOffTheTee = Number(totalStrokesGainedOffTheTee.toFixed(2));
                totalStrokesGainedApproach = Number(totalStrokesGainedApproach.toFixed(2));
                totalStrokesGainedShortGame = Number(totalStrokesGainedShortGame.toFixed(2));
                totalStrokesGainedPutting = Number(totalStrokesGainedPutting.toFixed(2));
            }
        });

        return {
            totalStrokesGained,
            totalStrokesGainedOffTheTee,
            offTheTeeShots,
            totalStrokesGainedApproach,
            approachShots,
            totalStrokesGainedShortGame,
            shortGameShots,
            totalStrokesGainedPutting,
            putts,
        };
    }
}
