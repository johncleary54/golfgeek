import { ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { isOTTShot } from "./ShotTypeUtils";
import { StrokesGainedCalculator } from "./StrokesGainedCalculator";

// TODO: We should convert this to take in multiple rounds so we do less calculations in the MainCalculator file

export class ShotLocationCalculator {
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

    // **  Fairway Accuracy is the percentage of times a player hits the fairway with their tee shot.
    calcFairwayAccuracyPerRound(): {
        percent: number;
        fairwayTeeShots: number;
        totalTeeShots: number;
    } {
        let totalTeeShots = 0;
        let fairwayTeeShots = 0;

        this.holes.forEach((hole) => {
            const holeShots = this.shots.filter((shot) => shot.hole === hole.hole);

            for (let i = 0; i < holeShots.length; i++) {
                const shot = holeShots[i];
                const nextShot = holeShots[i + 1];

                if (!shot) {
                    continue;
                }

                if (
                    isOTTShot({
                        location: shot.location,
                        par: hole.par,
                    })
                ) {
                    totalTeeShots++;

                    if (nextShot?.location === ShotLocation.Fairway) {
                        fairwayTeeShots++;
                    }
                }
            }
        });

        const fairwayPercentage = totalTeeShots === 0 ? 0 : (fairwayTeeShots / totalTeeShots) * 100;

        return {
            percent: fairwayPercentage,
            fairwayTeeShots,
            totalTeeShots,
        };
    }

    // ** Poor Tee Shots is the percentage of tee shots that lose 0.5 strokes or more
    calcPoorTeeShotsPerRound(): {
        percent: number;
        poorTeeShots: number;
        totalTeeShots: number;
    } {
        const strokesGainedCalc = new StrokesGainedCalculator(this.round, this.shots, this.holes);
        const strokesGained = strokesGainedCalc.calcStrokesGainedPerRound();
        // This is an array of all the shots that were hit off the tee in the round provided
        const shotsOTT = strokesGained.offTheTeeShots;

        const totalTeeShots = shotsOTT.length;
        let poorTeeShots = 0;

        shotsOTT.forEach((shot) => {
            if (shot.strokesGained <= -0.5) {
                poorTeeShots++;
            }
        });

        const poorShotPercentage = totalTeeShots === 0 ? 0 : (poorTeeShots / totalTeeShots) * 100;

        return {
            percent: poorShotPercentage,
            poorTeeShots,
            totalTeeShots,
        };
    }

    calcGreatTeeShotsPerRound(): {
        percent: number;
        greatTeeShots: number;
        totalTeeShots: number;
    } {
        const strokesGainedCalc = new StrokesGainedCalculator(this.round, this.shots, this.holes);
        const strokesGained = strokesGainedCalc.calcStrokesGainedPerRound();
        // This is an array of all the shots that were hit off the tee in the round provided
        const shotsOTT = strokesGained.offTheTeeShots;

        const totalTeeShots = shotsOTT.length;
        let greatTeeShots = 0;

        shotsOTT.forEach((shot) => {
            if (shot.strokesGained >= 0.5) {
                greatTeeShots++;
            }
        });

        const greatShotPercentage = totalTeeShots === 0 ? 0 : (greatTeeShots / totalTeeShots) * 100;

        return {
            percent: greatShotPercentage,
            greatTeeShots,
            totalTeeShots,
        };
    }

    // ** Penalty Percentage is the percentage of times a player incurs a penalty from a tee shot
    calcPenaltyPercentagePerRound(): {
        percent: number;
        penalties: number;
        totalTeeShots: number;
    } {
        let totalTeeShots = 0;
        let penalties = 0;

        this.holes.forEach((hole) => {
            const holeShots = this.shots.filter((shot) => shot.hole === hole.hole);

            for (let i = 0; i < holeShots.length; i++) {
                const shot = holeShots[i];
                const nextShot = holeShots[i + 1];

                if (!shot) {
                    continue;
                }

                if (
                    isOTTShot({
                        location: shot.location,
                        par: hole.par,
                    })
                ) {
                    totalTeeShots++;

                    if (nextShot?.location === ShotLocation.Penalty) {
                        penalties++;
                    }
                }
            }
        });

        const penaltyPercentage =
            totalTeeShots === 0 ? 0 : +((penalties / totalTeeShots) * 100).toFixed(2);

        return {
            percent: penaltyPercentage,
            penalties,
            totalTeeShots,
        };
    }
}
