import {
    ApproachDistanceBucket,
    PuttingDistanceBucket,
    ShortGameDistanceBucket,
    ShotLocation,
} from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { StrokesGainedCalculator } from "./StrokesGainedCalculator";

// TODO: Refactor this to be more generic and reusable

export type DistanceBucketReturnShortGame = {
    round: Record<ShortGameDistanceBucket, number>;
    shot: Record<ShortGameDistanceBucket, number>;
};

export type DistanceBucketReturnApproach = {
    round: Record<ApproachDistanceBucket, number>;
    shot: Record<ApproachDistanceBucket, number>;
};

type AveragesCalculatorReturn = {
    calcAverageStrokesGained(): StrokesGainedAverage;
};

type StrokesGainedAverage = {
    averageSGForAllRounds: number;
    averageSGOTTForAllRounds: number;
    averageSGOTTForAllShots: number;
    averageSGOTTForAllRoundsPar4: number;
    averageSGOTTForAllRoundsPar5: number;
    averageSGApproachForAllRounds: number;
    averageSGShortGameForAllRounds: number;
    averageSGPuttingForAllRounds: number;
    averageSGPuttingLessThan10: number;
    averageSGPutting10_24: number;
    averageSGPutting25Plus: number;
    averageSGPuttingDistanceBuckets: {
        round: Record<PuttingDistanceBucket, number>;
        shot: Record<PuttingDistanceBucket, number>;
    };
    averageSGApproachFairwayDistanceBuckets: DistanceBucketReturnApproach;
    averageSGApproachRoughDistanceBuckets: DistanceBucketReturnApproach;
    averageSGApproachDistanceBuckets: DistanceBucketReturnApproach;
    averageSGFairwayShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGRoughShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGSandShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGShortGameDistanceBuckets: DistanceBucketReturnShortGame;
};
export class AveragesCalculator implements AveragesCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
    }

    calcAverageStrokesGained(): StrokesGainedAverage {
        // This is the main function that calculates all the strokes gained stats
        const roundStats = this.rounds
            .map((round, i) => {
                const shots = this.shots[i];
                const holes = this.holes[i];
                if (
                    !shots ||
                    !holes ||
                    !shots[0] ||
                    !holes[0] ||
                    round.id !== shots[0].roundId ||
                    round.id !== holes[0].roundId
                ) {
                    return {
                        numberOfHolesForRound: 0,
                        totalStrokesGainedForRound: 0,
                        totalStrokesGainedOTTForRound: 0,
                        totalStrokesGainedApproachForRound: 0,
                        totalStrokesGainedShortGameForRound: 0,
                        totalStrokesGainedPuttingForRound: 0,
                        offTheTeeShots: [],
                        approachShots: [],
                        shortGameShots: [],
                        putts: [],
                    };
                }

                const calculator = new StrokesGainedCalculator(round, shots, holes);

                const {
                    totalStrokesGained,
                    totalStrokesGainedOffTheTee,
                    offTheTeeShots,
                    totalStrokesGainedApproach,
                    approachShots,
                    totalStrokesGainedShortGame,
                    shortGameShots,
                    totalStrokesGainedPutting,
                    putts,
                } = calculator.calcStrokesGainedPerRound();

                const numberOfHoles = holes.length;

                return {
                    numberOfHolesForRound: numberOfHoles,
                    totalStrokesGainedForRound: totalStrokesGained,
                    totalStrokesGainedOTTForRound: totalStrokesGainedOffTheTee,
                    totalStrokesGainedApproachForRound: totalStrokesGainedApproach,
                    totalStrokesGainedShortGameForRound: totalStrokesGainedShortGame,
                    totalStrokesGainedPuttingForRound: totalStrokesGainedPutting,
                    // Shots with strokes gained
                    offTheTeeShots,
                    approachShots,
                    shortGameShots,
                    putts,
                };
            })
            .filter(Boolean);

        let totalHolesForAllRounds = 0;
        let totalStrokesGainedForAllRounds = 0;

        for (const round of roundStats) {
            totalHolesForAllRounds += round.numberOfHolesForRound;
            totalStrokesGainedForAllRounds += round.totalStrokesGainedForRound;
        }

        // ** Strokes gained off the tee
        let totalStrokesGainedOTTForAllRounds = 0;
        let totalOTTShots = 0;
        let totalStrokesGainedOTTForAllRoundsPar4 = 0;
        let totalStrokesGainedOTTForAllRoundsPar5 = 0;

        for (const round of roundStats) {
            totalStrokesGainedOTTForAllRounds += round.totalStrokesGainedOTTForRound;
            totalOTTShots += round.offTheTeeShots.length;

            for (const shot of round.offTheTeeShots) {
                switch (shot.par) {
                    case 4:
                        totalStrokesGainedOTTForAllRoundsPar4 += shot.strokesGained;
                        break;
                    case 5:
                        totalStrokesGainedOTTForAllRoundsPar5 += shot.strokesGained;
                        break;
                    default:
                        break;
                }
            }
        }

        // ** Strokes gained approach
        let totalStrokesGainedApproachForAllRounds = 0;
        for (const round of roundStats) {
            totalStrokesGainedApproachForAllRounds += round.totalStrokesGainedApproachForRound;
        }

        // ** Strokes gained short game
        let totalStrokesGainedShortGameForAllRounds = 0;
        for (const round of roundStats) {
            totalStrokesGainedShortGameForAllRounds += round.totalStrokesGainedShortGameForRound;
        }

        // ** Strokes gained putting
        let totalStrokesGainedPuttingForAllRounds = 0;
        for (const round of roundStats) {
            totalStrokesGainedPuttingForAllRounds += round.totalStrokesGainedPuttingForRound;
        }

        let totalStrokesGainedPuttingLessThan10 = 0;
        let totalStrokesGainedPutting10_24 = 0;
        let totalStrokesGainedPutting25Plus = 0;

        for (const round of roundStats) {
            for (const putt of round.putts) {
                const { distance, strokesGained } = putt;
                if (distance < 10) {
                    totalStrokesGainedPuttingLessThan10 += strokesGained;
                } else if (distance >= 10 && distance < 25) {
                    totalStrokesGainedPutting10_24 += strokesGained;
                } else if (distance >= 25) {
                    totalStrokesGainedPutting25Plus += strokesGained;
                }
            }
        }

        // ** Averages

        const averageSGForAllRounds = calcAvgSGRound(totalStrokesGainedForAllRounds);

        const averageSGOTTForAllRounds = calcAvgSGRound(totalStrokesGainedOTTForAllRounds);
        const averageSGOTTForAllShots = calcAvgSGShot(
            totalStrokesGainedOTTForAllRounds,
            totalOTTShots,
        );
        const averageSGOTTForAllRoundsPar4 = calcAvgSGRound(totalStrokesGainedOTTForAllRoundsPar4);
        const averageSGOTTForAllRoundsPar5 = calcAvgSGRound(totalStrokesGainedOTTForAllRoundsPar5);

        const averageSGApproachForAllRounds = calcAvgSGRound(
            totalStrokesGainedApproachForAllRounds,
        );

        const averageSGShortGameForAllRounds = calcAvgSGRound(
            totalStrokesGainedShortGameForAllRounds,
        );

        const averageSGPuttingForAllRounds = calcAvgSGRound(totalStrokesGainedPuttingForAllRounds);
        const averageSGPuttingLessThan10 = calcAvgSGRound(totalStrokesGainedPuttingLessThan10);
        const averageSGPutting10_24 = calcAvgSGRound(totalStrokesGainedPutting10_24);
        const averageSGPutting25Plus = calcAvgSGRound(totalStrokesGainedPutting25Plus);

        /////////////////////////////

        const averageSGPuttingDistanceBuckets: {
            round: Record<PuttingDistanceBucket, number>;
            shot: Record<PuttingDistanceBucket, number>;
        } = {
            round: {
                [PuttingDistanceBucket.Putting_0_2]: 0,
                [PuttingDistanceBucket.Putting_3_5]: 0,
                [PuttingDistanceBucket.Putting_6_9]: 0,
                [PuttingDistanceBucket.Putting_10_15]: 0,
                [PuttingDistanceBucket.Putting_16_25]: 0,
                [PuttingDistanceBucket.Putting_26_40]: 0,
                [PuttingDistanceBucket.Putting_41_60]: 0,
                [PuttingDistanceBucket.Putting_61Plus]: 0,
            },
            shot: {
                [PuttingDistanceBucket.Putting_0_2]: 0,
                [PuttingDistanceBucket.Putting_3_5]: 0,
                [PuttingDistanceBucket.Putting_6_9]: 0,
                [PuttingDistanceBucket.Putting_10_15]: 0,
                [PuttingDistanceBucket.Putting_16_25]: 0,
                [PuttingDistanceBucket.Putting_26_40]: 0,
                [PuttingDistanceBucket.Putting_41_60]: 0,
                [PuttingDistanceBucket.Putting_61Plus]: 0,
            },
        };

        const averageSGApproachFairwayDistanceBuckets: {
            round: Record<ApproachDistanceBucket, number>;
            shot: Record<ApproachDistanceBucket, number>;
        } = {
            round: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
            shot: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
        };

        const averageSGApproachRoughDistanceBuckets: {
            round: Record<ApproachDistanceBucket, number>;
            shot: Record<ApproachDistanceBucket, number>;
        } = {
            round: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
            shot: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
        };

        const averageSGApproachDistanceBuckets: {
            round: Record<ApproachDistanceBucket, number>;
            shot: Record<ApproachDistanceBucket, number>;
        } = {
            round: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
            shot: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
        };

        const averageSGFairwayShortGameDistanceBuckets: {
            round: Record<ShortGameDistanceBucket, number>;
            shot: Record<ShortGameDistanceBucket, number>;
        } = {
            round: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            shot: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
        };

        const averageSGRoughShortGameDistanceBuckets: {
            round: Record<ShortGameDistanceBucket, number>;
            shot: Record<ShortGameDistanceBucket, number>;
        } = {
            round: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            shot: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
        };

        const averageSGSandShortGameDistanceBuckets: {
            round: Record<ShortGameDistanceBucket, number>;
            shot: Record<ShortGameDistanceBucket, number>;
        } = {
            round: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            shot: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
        };

        const averageSGShortGameDistanceBuckets: {
            round: Record<ShortGameDistanceBucket, number>;
            shot: Record<ShortGameDistanceBucket, number>;
        } = {
            round: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            shot: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
        };

        const puttDistanceBuckets = [
            { key: PuttingDistanceBucket.Putting_0_2, range: [0, 2] },
            { key: PuttingDistanceBucket.Putting_3_5, range: [3, 5] },
            { key: PuttingDistanceBucket.Putting_6_9, range: [6, 9] },
            { key: PuttingDistanceBucket.Putting_10_15, range: [10, 15] },
            { key: PuttingDistanceBucket.Putting_16_25, range: [16, 25] },
            { key: PuttingDistanceBucket.Putting_26_40, range: [26, 40] },
            { key: PuttingDistanceBucket.Putting_41_60, range: [41, 60] },
            { key: PuttingDistanceBucket.Putting_61Plus, range: [61, Infinity] },
        ];

        const approachDistanceBuckets = [
            { key: ApproachDistanceBucket.Approach_101_150, range: [101, 150] },
            { key: ApproachDistanceBucket.Approach_151_200, range: [151, 200] },
            { key: ApproachDistanceBucket.Approach_201_250, range: [201, 250] },
            { key: ApproachDistanceBucket.Approach_251Plus, range: [251, Infinity] },
        ];

        const shortGameDistanceBuckets = [
            { key: ShortGameDistanceBucket.ShortGame_0_25, range: [0, 25] },
            { key: ShortGameDistanceBucket.ShortGame_26_50, range: [26, 50] },
            { key: ShortGameDistanceBucket.ShortGame_51_75, range: [51, 75] },
            { key: ShortGameDistanceBucket.ShortGame_76_100, range: [76, 100] },
        ];

        /**
         * This calculates the average strokes gained for each distance bucket for putts
         */
        for (const { key, range } of puttDistanceBuckets) {
            const [minDistance = 0, maxDistance = Infinity] = range;

            let totalStrokesGained = 0;
            let totalPutts = 0;
            let totalHolesPlayed = 0;

            for (const round of roundStats) {
                for (const putt of round.putts) {
                    const { location, distance, strokesGained } = putt;
                    if (
                        location === ShotLocation.Green &&
                        distance >= minDistance &&
                        distance <= maxDistance
                    ) {
                        totalStrokesGained += strokesGained;
                        totalPutts++;
                    }
                }

                totalHolesPlayed += round.numberOfHolesForRound;
            }

            const averageSGPerShot =
                totalPutts > 0 ? (totalStrokesGained / totalPutts).toFixed(2) : "0";
            const averageSGPerRound =
                totalHolesPlayed > 0
                    ? (totalStrokesGained / (totalHolesPlayed / 18)).toFixed(2)
                    : "0";

            averageSGPuttingDistanceBuckets.round[key] = Number(averageSGPerRound);
            averageSGPuttingDistanceBuckets.shot[key] = Number(averageSGPerShot);
        }

        /**
         * This calculates the average strokes gained for each distance bucket for approach shots
         * fairway and rough
         */
        for (const { key, range } of approachDistanceBuckets) {
            const [minDistance = 0, maxDistance = Infinity] = range;

            // For Fairway Approach Shots
            let totalStrokesGainedFairway = 0;
            let totalFairwayShots = 0;
            let totalFairwayHolesPlayed = 0;

            // For Rough Approach Shots
            let totalStrokesGainedRough = 0;
            let totalRoughShots = 0;
            let totalRoughHolesPlayed = 0;

            let totalStrokesGained = 0;
            let totalShots = 0;
            let totalHolesPlayed = 0;

            for (const round of roundStats) {
                for (const shot of round.approachShots) {
                    const { location, distance, strokesGained } = shot;
                    if (distance >= minDistance && distance <= maxDistance) {
                        if (location === ShotLocation.Fairway || location === ShotLocation.Tee) {
                            totalStrokesGainedFairway += strokesGained;
                            totalFairwayShots++;
                        } else if (location === ShotLocation.Rough) {
                            totalStrokesGainedRough += strokesGained;
                            totalRoughShots++;
                        }

                        totalStrokesGained += strokesGained;
                        totalShots++;
                    }
                }

                if (
                    round.approachShots.some(
                        (shot) =>
                            shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee,
                    )
                ) {
                    totalFairwayHolesPlayed += round.numberOfHolesForRound;
                }

                if (round.approachShots.some((shot) => shot.location === ShotLocation.Rough)) {
                    totalRoughHolesPlayed += round.numberOfHolesForRound;
                }

                totalHolesPlayed += round.numberOfHolesForRound;
            }

            const averageSGFairwayPerShot =
                totalFairwayShots > 0
                    ? calcAvgSGShot(totalStrokesGainedFairway, totalFairwayShots)
                    : 0;
            const averageSGFairwayPerRound =
                totalFairwayHolesPlayed > 0 ? calcAvgSGRound(totalStrokesGainedFairway) : 0;

            const averageSGRoughPerShot =
                totalRoughShots > 0 ? calcAvgSGShot(totalStrokesGainedRough, totalRoughShots) : 0;
            const averageSGRoughPerRound =
                totalRoughHolesPlayed > 0 ? calcAvgSGRound(totalStrokesGainedRough) : 0;

            const averageSGPerShot =
                totalShots > 0 ? calcAvgSGShot(totalStrokesGained, totalShots) : 0;
            const averageSGPerRound = totalHolesPlayed > 0 ? calcAvgSGRound(totalStrokesGained) : 0;

            averageSGApproachFairwayDistanceBuckets.round[key] = Number(averageSGFairwayPerRound);
            averageSGApproachFairwayDistanceBuckets.shot[key] = Number(averageSGFairwayPerShot);

            averageSGApproachRoughDistanceBuckets.round[key] = Number(averageSGRoughPerRound);
            averageSGApproachRoughDistanceBuckets.shot[key] = Number(averageSGRoughPerShot);

            averageSGApproachDistanceBuckets.round[key] = Number(averageSGPerRound);
            averageSGApproachDistanceBuckets.shot[key] = Number(averageSGPerShot);
        }

        // Calculate average strokes gained for each distance bucket for short game shots per shot and per round
        for (const { key, range } of shortGameDistanceBuckets) {
            const [minDistance = 0, maxDistance = Infinity] = range;

            // For Fairway Short Game Shots
            let totalStrokesGainedFairway = 0;
            let totalFairwayShots = 0;
            let totalFairwayHolesPlayed = 0;

            // For Rough Short Game Shots
            let totalStrokesGainedRough = 0;
            let totalRoughShots = 0;
            let totalRoughHolesPlayed = 0;

            // For Sand Short Game Shots
            let totalStrokesGainedSand = 0;
            let totalSandShots = 0;
            let totalSandHolesPlayed = 0;

            let totalStrokesGained = 0;
            let totalShots = 0;
            let totalHolesPlayed = 0;

            for (const round of roundStats) {
                for (const shot of round.shortGameShots) {
                    const { location, distance, strokesGained } = shot;
                    if (distance >= minDistance && distance <= maxDistance) {
                        if (location === ShotLocation.Fairway || location === ShotLocation.Tee) {
                            totalStrokesGainedFairway += strokesGained;
                            totalFairwayShots++;
                        } else if (location === ShotLocation.Rough) {
                            totalStrokesGainedRough += strokesGained;
                            totalRoughShots++;
                        } else if (location === ShotLocation.Sand) {
                            totalStrokesGainedSand += strokesGained;
                            totalSandShots++;
                        }

                        totalStrokesGained += strokesGained;

                        totalShots++;
                    }
                }

                if (
                    round.shortGameShots.some(
                        (shot) =>
                            shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee,
                    )
                ) {
                    totalFairwayHolesPlayed += round.numberOfHolesForRound;
                }

                if (round.shortGameShots.some((shot) => shot.location === ShotLocation.Rough)) {
                    totalRoughHolesPlayed += round.numberOfHolesForRound;
                }

                if (round.shortGameShots.some((shot) => shot.location === ShotLocation.Sand)) {
                    totalSandHolesPlayed += round.numberOfHolesForRound;
                }

                totalHolesPlayed += round.numberOfHolesForRound;
            }

            const averageSGFairwayPerShot =
                totalFairwayShots > 0
                    ? calcAvgSGShot(totalStrokesGainedFairway, totalFairwayShots)
                    : 0;
            const averageSGFairwayPerRound =
                totalFairwayHolesPlayed > 0 ? calcAvgSGRound(totalStrokesGainedFairway) : 0;

            const averageSGRoughPerShot =
                totalRoughShots > 0 ? calcAvgSGShot(totalStrokesGainedRough, totalRoughShots) : 0;
            const averageSGRoughPerRound =
                totalRoughHolesPlayed > 0 ? calcAvgSGRound(totalStrokesGainedRough) : 0;

            const averageSGSandPerShot =
                totalSandShots > 0 ? calcAvgSGShot(totalStrokesGainedSand, totalSandShots) : 0;
            const averageSGSandPerRound =
                totalSandHolesPlayed > 0 ? calcAvgSGRound(totalStrokesGainedSand) : 0;

            const averageSGPerShot =
                totalShots > 0 ? calcAvgSGShot(totalStrokesGained, totalShots) : 0;
            const averageSGPerRound = totalHolesPlayed > 0 ? calcAvgSGRound(totalStrokesGained) : 0;

            averageSGShortGameDistanceBuckets.round[key] = Number(averageSGPerRound);
            averageSGShortGameDistanceBuckets.shot[key] = Number(averageSGPerShot);

            averageSGFairwayShortGameDistanceBuckets.round[key] = Number(averageSGFairwayPerRound);
            averageSGFairwayShortGameDistanceBuckets.shot[key] = Number(averageSGFairwayPerShot);

            averageSGRoughShortGameDistanceBuckets.round[key] = Number(averageSGRoughPerRound);
            averageSGRoughShortGameDistanceBuckets.shot[key] = Number(averageSGRoughPerShot);

            averageSGSandShortGameDistanceBuckets.round[key] = Number(averageSGSandPerRound);
            averageSGSandShortGameDistanceBuckets.shot[key] = Number(averageSGSandPerShot);
        }

        return {
            averageSGForAllRounds,
            averageSGOTTForAllRounds,
            averageSGOTTForAllShots,
            averageSGOTTForAllRoundsPar4,
            averageSGOTTForAllRoundsPar5,
            averageSGApproachForAllRounds,
            averageSGShortGameForAllRounds,
            averageSGPuttingForAllRounds,
            averageSGPuttingLessThan10,
            averageSGPutting10_24,
            averageSGPutting25Plus,
            averageSGPuttingDistanceBuckets,
            averageSGApproachFairwayDistanceBuckets,
            averageSGApproachRoughDistanceBuckets,
            averageSGApproachDistanceBuckets,
            averageSGFairwayShortGameDistanceBuckets,
            averageSGRoughShortGameDistanceBuckets,
            averageSGSandShortGameDistanceBuckets,
            averageSGShortGameDistanceBuckets,
        };

        function calcAvgSGRound(totalStrokesGained: number): number {
            const strokesGainedPerRound = totalStrokesGained / (totalHolesForAllRounds / 18);
            return Number(strokesGainedPerRound.toFixed(2));
        }

        function calcAvgSGShot(
            totalStrokesGainedForShotType: number,
            shotsPlayedOfShotType: number,
        ): number {
            const strokesGainedPerShot = totalStrokesGainedForShotType / shotsPlayedOfShotType;
            return Number(strokesGainedPerShot.toFixed(2));
        }
    }
}
