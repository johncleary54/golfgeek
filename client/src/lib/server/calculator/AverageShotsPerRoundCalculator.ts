import { ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { isApproachShot, isOTTShot, isShortGameShot } from "./ShotTypeUtils";
import { ApproachDistanceBucket, ShortGameDistanceBucket, PuttingDistanceBucket } from "$lib/types";

type AverageShotsPerRoundReturn = {
    teeShots: number;
    greenShotDistanceBuckets: Record<PuttingDistanceBucket, number>;
    roughApproachShotDistanceBuckets: Record<ApproachDistanceBucket, number>;
    fairwayApproachShotDistanceBuckets: Record<ApproachDistanceBucket, number>;
    roughShortGameDistanceBuckets: Record<ShortGameDistanceBucket, number>;
    fairwayShortGameDistanceBuckets: Record<ShortGameDistanceBucket, number>;
    sandShortGameDistanceBuckets: Record<ShortGameDistanceBucket, number>;
};

type AverageShotsPerRoundCalculatorReturn = {
    calcAverageShotsPerRound(): AverageShotsPerRoundReturn;
};
export class AverageShotsPerRoundCalculator implements AverageShotsPerRoundCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];
    totalHoles: number;

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
        this.totalHoles = 0;
    }

    calcAverageShotsPerRound(): AverageShotsPerRoundReturn {
        const results: AverageShotsPerRoundReturn = {
            teeShots: 0,
            greenShotDistanceBuckets: {
                [PuttingDistanceBucket.Putting_0_2]: 0,
                [PuttingDistanceBucket.Putting_3_5]: 0,
                [PuttingDistanceBucket.Putting_6_9]: 0,
                [PuttingDistanceBucket.Putting_10_15]: 0,
                [PuttingDistanceBucket.Putting_16_25]: 0,
                [PuttingDistanceBucket.Putting_26_40]: 0,
                [PuttingDistanceBucket.Putting_41_60]: 0,
                [PuttingDistanceBucket.Putting_61Plus]: 0,
            },
            roughApproachShotDistanceBuckets: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
            fairwayApproachShotDistanceBuckets: {
                [ApproachDistanceBucket.Approach_101_150]: 0,
                [ApproachDistanceBucket.Approach_151_200]: 0,
                [ApproachDistanceBucket.Approach_201_250]: 0,
                [ApproachDistanceBucket.Approach_251Plus]: 0,
            },
            roughShortGameDistanceBuckets: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            fairwayShortGameDistanceBuckets: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
            sandShortGameDistanceBuckets: {
                [ShortGameDistanceBucket.ShortGame_0_25]: 0,
                [ShortGameDistanceBucket.ShortGame_26_50]: 0,
                [ShortGameDistanceBucket.ShortGame_51_75]: 0,
                [ShortGameDistanceBucket.ShortGame_76_100]: 0,
            },
        };

        let totalTeeShots = 0;

        for (const round of this.rounds) {
            const shotsForRound = this.shots.find((shots) => shots[0]?.roundId === round.id) ?? [];
            const holesForRound = this.holes.find((holes) => holes[0]?.roundId === round.id) ?? [];

            const holesPlayed = holesForRound.length;

            this.totalHoles += holesPlayed;

            totalTeeShots += shotsForRound.filter((shot) => {
                const hole = holesForRound.find((h) => h.hole === shot.hole);

                if (!hole) {
                    return false;
                }

                return isOTTShot({
                    location: shot.location,
                    par: hole.par,
                });
            }).length;

            const calcShotDistanceBucketCountApproach = (
                locations: ShotLocation[],
                minDistance: number,
                maxDistance: number,
            ): number => {
                const shotsInRange = shotsForRound.filter((shot) => {
                    const hole = holesForRound.find((h) => h.hole === shot.hole);

                    if (!hole) {
                        return false;
                    }

                    const isApproach = isApproachShot({
                        location: shot.location,
                        distance: shot.distance,
                        par: hole.par,
                    });

                    return (
                        isApproach &&
                        (!locations.length || locations.includes(shot.location)) &&
                        shot.distance >= minDistance &&
                        shot.distance <= maxDistance
                    );
                });

                return shotsInRange.length || 0;
            };

            const calcShotDistanceBucketCountShortGame = (
                locations: ShotLocation[],
                minDistance: number,
                maxDistance: number,
            ): number => {
                const shotsInRange = shotsForRound.filter((shot) => {
                    const hole = holesForRound.find((h) => h.hole === shot.hole);

                    if (!hole) {
                        return false;
                    }

                    const isShortGame = isShortGameShot({
                        location: shot.location,
                        distance: shot.distance,
                        par: hole.par,
                    });

                    return (
                        isShortGame &&
                        (!locations.length || locations.includes(shot.location)) &&
                        shot.distance >= minDistance &&
                        shot.distance <= maxDistance
                    );
                });

                return shotsInRange.length || 0;
            };

            const calcShotDistanceBucketCountPutting = (
                minDistance: number,
                maxDistance: number,
            ): number => {
                const shotsInRange = shotsForRound.filter(
                    (shot) =>
                        shot.location === ShotLocation.Green &&
                        shot.distance >= minDistance &&
                        shot.distance <= maxDistance,
                );
                return shotsInRange.length || 0;
            };

            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_0_2] +=
                calcShotDistanceBucketCountPutting(0, 2);
            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_3_5] +=
                calcShotDistanceBucketCountPutting(3, 5);
            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_6_9] +=
                calcShotDistanceBucketCountPutting(6, 9);
            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_10_15] +=
                calcShotDistanceBucketCountPutting(10, 15);
            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_16_25] +=
                calcShotDistanceBucketCountPutting(16, 25);
            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_26_40] +=
                calcShotDistanceBucketCountPutting(26, 40);
            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_41_60] +=
                calcShotDistanceBucketCountPutting(41, 60);
            results.greenShotDistanceBuckets[PuttingDistanceBucket.Putting_61Plus] +=
                calcShotDistanceBucketCountPutting(61, Infinity);

            // Approach Rough
            results.roughApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_101_150] +=
                calcShotDistanceBucketCountApproach([ShotLocation.Rough], 101, 150);
            results.roughApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_151_200] +=
                calcShotDistanceBucketCountApproach([ShotLocation.Rough], 151, 200);
            results.roughApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_201_250] +=
                calcShotDistanceBucketCountApproach([ShotLocation.Rough], 201, 250);
            results.roughApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_251Plus] +=
                calcShotDistanceBucketCountApproach([ShotLocation.Rough], 251, Infinity);

            // Approach Fairway
            results.fairwayApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_101_150] +=
                calcShotDistanceBucketCountApproach(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    101,
                    150,
                );
            results.fairwayApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_151_200] +=
                calcShotDistanceBucketCountApproach(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    151,
                    200,
                );
            results.fairwayApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_201_250] +=
                calcShotDistanceBucketCountApproach(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    201,
                    250,
                );
            results.fairwayApproachShotDistanceBuckets[ApproachDistanceBucket.Approach_251Plus] +=
                calcShotDistanceBucketCountApproach(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    251,
                    Infinity,
                );

            // Short Game Rough
            results.roughShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_0_25] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Rough], 0, 25);
            results.roughShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_26_50] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Rough], 26, 50);
            results.roughShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_51_75] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Rough], 51, 75);
            results.roughShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_76_100] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Rough], 76, 100);

            // Short Game Fairway
            results.fairwayShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_0_25] +=
                calcShotDistanceBucketCountShortGame(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    0,
                    25,
                );
            results.fairwayShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_26_50] +=
                calcShotDistanceBucketCountShortGame(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    26,
                    50,
                );
            results.fairwayShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_51_75] +=
                calcShotDistanceBucketCountShortGame(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    51,
                    75,
                );
            results.fairwayShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_76_100] +=
                calcShotDistanceBucketCountShortGame(
                    [ShotLocation.Fairway, ShotLocation.Tee],
                    76,
                    100,
                );

            // Short Game Sand
            results.sandShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_0_25] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Sand], 0, 25);
            results.sandShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_26_50] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Sand], 26, 50);
            results.sandShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_51_75] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Sand], 51, 75);
            results.sandShortGameDistanceBuckets[ShortGameDistanceBucket.ShortGame_76_100] +=
                calcShotDistanceBucketCountShortGame([ShotLocation.Sand], 76, 100);
        }

        const scaleTo18Holes = (count: number | undefined): number =>
            count ? +(count * (18 / this.totalHoles)).toFixed(2) : 0;

        results.teeShots = scaleTo18Holes(totalTeeShots);

        for (const distanceBucket in results.greenShotDistanceBuckets) {
            const key = distanceBucket as PuttingDistanceBucket;
            results.greenShotDistanceBuckets[key] = scaleTo18Holes(
                results.greenShotDistanceBuckets[key],
            );
        }

        for (const distanceBucket in results.roughApproachShotDistanceBuckets) {
            const key = distanceBucket as ApproachDistanceBucket;
            results.roughApproachShotDistanceBuckets[key] = scaleTo18Holes(
                results.roughApproachShotDistanceBuckets[key],
            );
        }

        for (const distanceBucket in results.fairwayApproachShotDistanceBuckets) {
            const key = distanceBucket as ApproachDistanceBucket;
            results.fairwayApproachShotDistanceBuckets[key] = scaleTo18Holes(
                results.fairwayApproachShotDistanceBuckets[key],
            );
        }

        for (const distanceBucket in results.roughShortGameDistanceBuckets) {
            const key = distanceBucket as ShortGameDistanceBucket;
            results.roughShortGameDistanceBuckets[key] = scaleTo18Holes(
                results.roughShortGameDistanceBuckets[key],
            );
        }

        for (const distanceBucket in results.fairwayShortGameDistanceBuckets) {
            const key = distanceBucket as ShortGameDistanceBucket;
            results.fairwayShortGameDistanceBuckets[key] = scaleTo18Holes(
                results.fairwayShortGameDistanceBuckets[key],
            );
        }

        for (const distanceBucket in results.sandShortGameDistanceBuckets) {
            const key = distanceBucket as ShortGameDistanceBucket;
            results.sandShortGameDistanceBuckets[key] = scaleTo18Holes(
                results.sandShortGameDistanceBuckets[key],
            );
        }

        return results;
    }
}
