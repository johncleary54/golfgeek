import { ShortGameDistanceBucket, ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { StrokesGainedCalculator, type ShotStrokesGained } from "./StrokesGainedCalculator";

type ShortGameShotLocationCalculatorReturn = {
    calcPoorShortGameShotsPerRound(roundIndex: number): {
        percent: number;
        poorShortGameShotsAmount: number;
        totalShortGameShots: number;
        poorShortGameShots: ShotStrokesGained[];
    };
    calcGreatShortGameShotsPerRound(roundIndex: number): {
        percent: number;
        greatShortGameShotsAmount: number;
        totalShortGameShots: number;
        greatShortGameShots: ShotStrokesGained[];
    };
    calcAveragePoorShortGameShotPercentageByDistanceBucket(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    };
    calcAverageGreatShortGameShotPercentageByDistanceBucket(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    };
};

export class ShortGameShotLocationCalculator implements ShortGameShotLocationCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;

        if (this.rounds.length !== this.shots.length || this.rounds.length !== this.holes.length) {
            throw new Error("Number of rounds, shots, and holes must match");
        }

        for (let i = 0; i < this.rounds.length; i++) {
            const currentShot = this.shots[i];
            const currentHole = this.holes[i];

            if (!currentShot || !currentHole) {
                throw new Error("Shots and holes must be provided for each round");
            }

            const mismatchedShots = currentShot.filter(
                (shot) => shot.roundId !== this.rounds[i]?.id,
            );
            const mismatchedHoles = currentHole.filter(
                (hole) => hole.roundId !== this.rounds[i]?.id,
            );

            if (mismatchedShots.length > 0 || mismatchedHoles.length > 0) {
                throw new Error("Holes and shots must be from the same round");
            }
        }
    }

    distanceBuckets: Record<ShortGameDistanceBucket, { min: number; max: number }> = {
        [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25 },
        [ShortGameDistanceBucket.ShortGame_26_50]: { min: 26, max: 50 },
        [ShortGameDistanceBucket.ShortGame_51_75]: { min: 51, max: 75 },
        [ShortGameDistanceBucket.ShortGame_76_100]: { min: 76, max: 100 },
    };

    calcPoorShortGameShotsPerRound(roundIndex: number): {
        percent: number;
        poorShortGameShotsAmount: number;
        totalShortGameShots: number;
        poorShortGameShots: ShotStrokesGained[];
    } {
        const round = this.rounds[roundIndex];
        const shots = this.shots[roundIndex];
        const holes = this.holes[roundIndex];

        if (!round) {
            throw new Error("Round not found");
        }

        if (!shots || !holes) {
            throw new Error("Shots and holes must be provided for each round");
        }

        const strokesGainedCalc = new StrokesGainedCalculator(round, shots, holes);
        const strokesGained = strokesGainedCalc.calcStrokesGainedPerRound();
        const shortGameShots = strokesGained.shortGameShots;

        const totalShortGameShots = shortGameShots.length;
        let poorShortGameShotsAmount = 0;

        shortGameShots.forEach((shot) => {
            if (shot.strokesGained < -0.5) {
                poorShortGameShotsAmount++;
            }
        });

        const poorShortGameShotPercentage =
            totalShortGameShots === 0 ? 0 : (poorShortGameShotsAmount / totalShortGameShots) * 100;

        const poorShortGameShots = shortGameShots.filter((shot) => shot.strokesGained < -0.5);

        return {
            percent: poorShortGameShotPercentage,
            poorShortGameShotsAmount,
            totalShortGameShots,
            poorShortGameShots,
        };
    }

    calcGreatShortGameShotsPerRound(roundIndex: number): {
        percent: number;
        greatShortGameShotsAmount: number;
        totalShortGameShots: number;
        greatShortGameShots: ShotStrokesGained[];
    } {
        const round = this.rounds[roundIndex];
        const shots = this.shots[roundIndex];
        const holes = this.holes[roundIndex];

        if (!round) {
            throw new Error("Round not found");
        }

        if (!shots || !holes) {
            throw new Error("Shots and holes must be provided for each round");
        }

        const strokesGainedCalc = new StrokesGainedCalculator(round, shots, holes);
        const strokesGained = strokesGainedCalc.calcStrokesGainedPerRound();
        const shortGameShots = strokesGained.shortGameShots;

        const totalShortGameShots = shortGameShots.length;
        let greatShortGameShotsAmount = 0;

        shortGameShots.forEach((shot) => {
            if (shot.strokesGained >= 0.5) {
                greatShortGameShotsAmount++;
            }
        });

        const greatShortGameShotPercentage =
            totalShortGameShots === 0 ? 0 : (greatShortGameShotsAmount / totalShortGameShots) * 100;

        const greatShortGameShots = shortGameShots.filter((shot) => shot.strokesGained >= 0.5);

        return {
            percent: greatShortGameShotPercentage,
            greatShortGameShotsAmount,
            totalShortGameShots,
            greatShortGameShots,
        };
    }

    calcAveragePoorShortGameShotPercentageByDistanceBucket(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    } {
        const poorShortGameShotPercentageByDistanceBucket: {
            fairway: Record<ShortGameDistanceBucket, number>;
            rough: Record<ShortGameDistanceBucket, number>;
            sand: Record<ShortGameDistanceBucket, number>;
        } = {
            fairway: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            rough: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            sand: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
        };

        for (const range in this.distanceBuckets) {
            const key = range as ShortGameDistanceBucket;
            const min = this.distanceBuckets[key].min;
            const max = this.distanceBuckets[key].max;

            let totalShortGameShots = 0;
            let poorFairwayShortGameShotsInRange = 0;
            let poorRoughShortGameShotsInRange = 0;
            let poorSandShortGameShotsInRange = 0;

            for (const round of this.rounds) {
                const roundIndex = this.rounds.indexOf(round);
                const roundResult = this.calcPoorShortGameShotsPerRound(roundIndex);
                const fairwayShortGameShotsArray = roundResult.poorShortGameShots.filter(
                    (shot) =>
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                poorFairwayShortGameShotsInRange += fairwayShortGameShotsArray.length;

                const roughShortGameShotsArray = roundResult.poorShortGameShots.filter(
                    (shot) =>
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                poorRoughShortGameShotsInRange += roughShortGameShotsArray.length;

                const sandShortGameShotsArray = roundResult.poorShortGameShots.filter(
                    (shot) =>
                        shot.location === ShotLocation.Sand &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                poorSandShortGameShotsInRange += sandShortGameShotsArray.length;

                totalShortGameShots += roundResult.totalShortGameShots;
            }

            const percentageInFairway =
                totalShortGameShots === 0
                    ? 0
                    : (poorFairwayShortGameShotsInRange / totalShortGameShots) * 100;

            const percentageInRough =
                totalShortGameShots === 0
                    ? 0
                    : (poorRoughShortGameShotsInRange / totalShortGameShots) * 100;

            const percentageInSand =
                totalShortGameShots === 0
                    ? 0
                    : (poorSandShortGameShotsInRange / totalShortGameShots) * 100;

            poorShortGameShotPercentageByDistanceBucket.fairway[key] =
                +percentageInFairway.toFixed(2);
            poorShortGameShotPercentageByDistanceBucket.rough[key] = +percentageInRough.toFixed(2);
            poorShortGameShotPercentageByDistanceBucket.sand[key] = +percentageInSand.toFixed(2);
        }

        return poorShortGameShotPercentageByDistanceBucket;
    }

    calcAverageGreatShortGameShotPercentageByDistanceBucket(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    } {
        const greatShortGameShotPercentageByDistanceBucket: {
            fairway: Record<ShortGameDistanceBucket, number>;
            rough: Record<ShortGameDistanceBucket, number>;
            sand: Record<ShortGameDistanceBucket, number>;
        } = {
            fairway: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            rough: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            sand: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
        };

        for (const range in this.distanceBuckets) {
            const key = range as ShortGameDistanceBucket;
            const min = this.distanceBuckets[key].min;
            const max = this.distanceBuckets[key].max;

            let totalShortGameShots = 0;
            let greatFairwayShortGameShotsInRange = 0;
            let greatRoughShortGameShotsInRange = 0;
            let greatSandShortGameShotsInRange = 0;

            for (const round of this.rounds) {
                const roundIndex = this.rounds.indexOf(round);
                const roundResult = this.calcGreatShortGameShotsPerRound(roundIndex);
                const fairwayShortGameShotsArray = roundResult.greatShortGameShots.filter(
                    (shot) =>
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                greatFairwayShortGameShotsInRange += fairwayShortGameShotsArray.length;

                const roughShortGameShotsArray = roundResult.greatShortGameShots.filter(
                    (shot) =>
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                greatRoughShortGameShotsInRange += roughShortGameShotsArray.length;

                const sandShortGameShotsArray = roundResult.greatShortGameShots.filter(
                    (shot) =>
                        shot.location === ShotLocation.Sand &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                greatSandShortGameShotsInRange += sandShortGameShotsArray.length;

                totalShortGameShots += roundResult.totalShortGameShots;
            }

            const percentageInFairway =
                totalShortGameShots === 0
                    ? 0
                    : (greatFairwayShortGameShotsInRange / totalShortGameShots) * 100;

            const percentageInRough =
                totalShortGameShots === 0
                    ? 0
                    : (greatRoughShortGameShotsInRange / totalShortGameShots) * 100;

            const percentageInSand =
                totalShortGameShots === 0
                    ? 0
                    : (greatSandShortGameShotsInRange / totalShortGameShots) * 100;

            greatShortGameShotPercentageByDistanceBucket.fairway[key] =
                +percentageInFairway.toFixed(2);
            greatShortGameShotPercentageByDistanceBucket.rough[key] = +percentageInRough.toFixed(2);
            greatShortGameShotPercentageByDistanceBucket.sand[key] = +percentageInSand.toFixed(2);
        }

        return greatShortGameShotPercentageByDistanceBucket;
    }
}
