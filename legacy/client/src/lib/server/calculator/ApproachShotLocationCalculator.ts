import { ApproachDistanceBucket, ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { StrokesGainedCalculator, type ShotStrokesGained } from "./StrokesGainedCalculator";

type ApproachShotLocationCalculatorReturn = {
    calcPoorApproachShotsPerRound(roundIndex: number): {
        percent: number;
        poorApproachShotsAmount: number;
        totalApproachShots: number;
        poorApproachShots: ShotStrokesGained[];
    };
    calcGreatApproachShotsPerRound(roundIndex: number): {
        percent: number;
        greatApproachShotsAmount: number;
        totalApproachShots: number;
        greatApproachShots: ShotStrokesGained[];
    };
    calcAverageGreatApproachShotPercentage(): number;
    calcAveragePoorApproachShotPercentage(): number;
    calcAveragePoorApproachShotPercentageByDistanceBucket(): {
        fairway: Record<string, number>;
        rough: Record<string, number>;
    };
    calcAverageGreatApproachShotPercentageByDistanceBucket(): {
        fairway: Record<string, number>;
        rough: Record<string, number>;
    };
};

export class ApproachShotLocationCalculator implements ApproachShotLocationCalculatorReturn {
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

    distanceBuckets: Record<ApproachDistanceBucket, { min: number; max: number }> = {
        [ApproachDistanceBucket.Approach_101_150]: { min: 101, max: 150 },
        [ApproachDistanceBucket.Approach_151_200]: { min: 151, max: 200 },
        [ApproachDistanceBucket.Approach_201_250]: { min: 201, max: 250 },
        [ApproachDistanceBucket.Approach_251Plus]: { min: 251, max: Infinity },
    };

    // ** Percentage of approach shots that lose 0.5 strokes or more
    calcPoorApproachShotsPerRound(roundIndex: number): {
        percent: number;
        poorApproachShotsAmount: number;
        totalApproachShots: number;
        poorApproachShots: ShotStrokesGained[];
        approachShots: ShotStrokesGained[];
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
        // This is an array of all the shots that were hit off the tee in the round provided
        const approachShots = strokesGained.approachShots;

        const totalApproachShots = approachShots.length;
        let poorApproachShotsAmount = 0;

        approachShots.forEach((shot) => {
            if (shot.strokesGained <= -0.5) {
                poorApproachShotsAmount++;
            }
        });

        const poorApproachShotPercentage =
            totalApproachShots === 0 ? 0 : (poorApproachShotsAmount / totalApproachShots) * 100;

        const poorApproachShots = approachShots.filter((shot) => shot.strokesGained <= -0.5);

        return {
            percent: poorApproachShotPercentage,
            poorApproachShotsAmount,
            totalApproachShots,
            poorApproachShots,
            approachShots,
        };
    }

    // ** Percentage of approach shots that gain 0.5 strokes or more
    calcGreatApproachShotsPerRound(roundIndex: number): {
        percent: number;
        greatApproachShotsAmount: number;
        totalApproachShots: number;
        greatApproachShots: ShotStrokesGained[];
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
        // This is an array of all the shots that were hit off the tee in the round provided
        const approachShots = strokesGained.approachShots;

        const totalApproachShots = approachShots.length;
        let greatApproachShotsAmount = 0;

        approachShots.forEach((shot) => {
            if (shot.strokesGained >= 0.5) {
                greatApproachShotsAmount++;
            }
        });

        const greatApproachShotPercentage =
            totalApproachShots === 0 ? 0 : (greatApproachShotsAmount / totalApproachShots) * 100;

        const greatApproachShots = approachShots.filter((shot) => shot.strokesGained >= 0.5);

        return {
            percent: greatApproachShotPercentage,
            greatApproachShotsAmount,
            totalApproachShots,
            greatApproachShots,
        };
    }

    calcAverageGreatApproachShotPercentage(): number {
        let totalGreatApproachShots = 0;
        let totalApproachShots = 0;

        for (const round of this.rounds) {
            const roundIndex = this.rounds.indexOf(round);
            const roundResult = this.calcGreatApproachShotsPerRound(roundIndex);
            totalGreatApproachShots += roundResult.greatApproachShotsAmount;
            totalApproachShots += roundResult.totalApproachShots;
        }

        if (totalApproachShots === 0) {
            return 0;
        }

        const greatApproachShotPercentage = +(
            (totalGreatApproachShots / totalApproachShots) *
            100
        ).toFixed(2);

        return greatApproachShotPercentage;
    }

    calcAveragePoorApproachShotPercentage(): number {
        let totalPoorApproachShots = 0;
        let totalApproachShots = 0;

        for (const round of this.rounds) {
            const roundIndex = this.rounds.indexOf(round);
            const roundResult = this.calcPoorApproachShotsPerRound(roundIndex);
            totalPoorApproachShots += roundResult.poorApproachShotsAmount;
            totalApproachShots += roundResult.totalApproachShots;
        }

        if (totalApproachShots === 0) {
            return 0;
        }

        const poorApproachShotPercentage = +(
            (totalPoorApproachShots / totalApproachShots) *
            100
        ).toFixed(2);

        return poorApproachShotPercentage;
    }

    calcAveragePoorApproachShotPercentageByDistanceBucket(): {
        fairway: Record<string, number>;
        rough: Record<string, number>;
    } {
        const poorApproachShotPercentageByDistanceBucket: {
            fairway: Record<string, number>;
            rough: Record<string, number>;
        } = {
            fairway: {},
            rough: {},
        };

        for (const range in this.distanceBuckets) {
            const key = range as ApproachDistanceBucket;
            const min = this.distanceBuckets[key].min;
            const max = this.distanceBuckets[key].max;

            let poorFairwayApproachShotsInRange = 0;
            let poorRoughApproachShotsInRange = 0;
            let totalApproachShotsInRangeFairway = 0;
            let totalApproachShotsInRangeRough = 0;

            for (const round of this.rounds) {
                const roundIndex = this.rounds.indexOf(round);
                const roundResult = this.calcPoorApproachShotsPerRound(roundIndex);
                const fairwayApproachShotsArray = roundResult.poorApproachShots.filter(
                    (shot) =>
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                poorFairwayApproachShotsInRange += fairwayApproachShotsArray.length;

                const roughApproachShotsArray = roundResult.poorApproachShots.filter(
                    (shot) =>
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                poorRoughApproachShotsInRange += roughApproachShotsArray.length;

                for (const shot of roundResult.approachShots) {
                    if (
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        totalApproachShotsInRangeFairway++;
                    }

                    if (
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        totalApproachShotsInRangeRough++;
                    }
                }
            }

            const percentageInFairway =
                totalApproachShotsInRangeFairway === 0
                    ? 0
                    : (poorFairwayApproachShotsInRange / totalApproachShotsInRangeFairway) * 100;

            const percentageInRough =
                totalApproachShotsInRangeRough === 0
                    ? 0
                    : (poorRoughApproachShotsInRange / totalApproachShotsInRangeRough) * 100;

            poorApproachShotPercentageByDistanceBucket.fairway[range] =
                +percentageInFairway.toFixed(2);
            poorApproachShotPercentageByDistanceBucket.rough[range] = +percentageInRough.toFixed(2);
        }

        return poorApproachShotPercentageByDistanceBucket;
    }

    calcAverageGreatApproachShotPercentageByDistanceBucket(): {
        fairway: Record<string, number>;
        rough: Record<string, number>;
    } {
        const greatApproachShotPercentageByDistanceBucket: {
            fairway: Record<string, number>;
            rough: Record<string, number>;
        } = {
            fairway: {},
            rough: {},
        };

        for (const range in this.distanceBuckets) {
            const key = range as ApproachDistanceBucket;
            const min = this.distanceBuckets[key].min;
            const max = this.distanceBuckets[key].max;

            let totalApproachShots = 0;
            let greatFairwayApproachShotsInRange = 0;
            let greatRoughApproachShotsInRange = 0;

            for (const round of this.rounds) {
                const roundIndex = this.rounds.indexOf(round);
                const roundResult = this.calcGreatApproachShotsPerRound(roundIndex);
                const fairwayApproachShotsArray = roundResult.greatApproachShots.filter(
                    (shot) =>
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                greatFairwayApproachShotsInRange += fairwayApproachShotsArray.length;

                const roughApproachShotsArray = roundResult.greatApproachShots.filter(
                    (shot) =>
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max,
                );
                greatRoughApproachShotsInRange += roughApproachShotsArray.length;

                totalApproachShots += roundResult.totalApproachShots;
            }

            const percentageInFairway =
                totalApproachShots === 0
                    ? 0
                    : (greatFairwayApproachShotsInRange / totalApproachShots) * 100;

            const percentageInRough =
                totalApproachShots === 0
                    ? 0
                    : (greatRoughApproachShotsInRange / totalApproachShots) * 100;

            greatApproachShotPercentageByDistanceBucket.fairway[range] =
                +percentageInFairway.toFixed(2);
            greatApproachShotPercentageByDistanceBucket.rough[range] =
                +percentageInRough.toFixed(2);
        }

        return greatApproachShotPercentageByDistanceBucket;
    }
}
