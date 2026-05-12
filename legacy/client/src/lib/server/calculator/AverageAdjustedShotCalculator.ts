import type { Round } from "../rounds/round.service";
import type { Hole } from "../rounds/hole.service";
import { AdjustedShotCalculator } from "./AdjustedShotCalculator";
import type { Shot } from "../rounds/shot.service";
import {
    PuttingDistanceBucket,
    ApproachDistanceBucket,
    ShotLocation,
    ShortGameDistanceBucket,
} from "$lib/types";
import { isApproachShot, isOTTShot, isShortGameShot } from "./ShotTypeUtils";

type RangeValue = { min: number; max: number; value: number };
type MultiRangeValue =
    | PuttingDistanceBucket.Putting_16_25
    | PuttingDistanceBucket.Putting_26_40
    | PuttingDistanceBucket.Putting_41_60
    | PuttingDistanceBucket.Putting_61Plus;

const TOUR_AVERAGES_ONE_PUTT: Record<PuttingDistanceBucket, RangeValue> = {
    [PuttingDistanceBucket.Putting_0_2]: { min: 0, max: 2, value: 99.79316338992 },
    [PuttingDistanceBucket.Putting_3_5]: { min: 3, max: 5, value: 90.8083532403483 },
    [PuttingDistanceBucket.Putting_6_9]: { min: 6, max: 9, value: 55.7977987610513 },
    [PuttingDistanceBucket.Putting_10_15]: { min: 10, max: 15, value: 31.4279800100541 },
    [PuttingDistanceBucket.Putting_16_25]: { min: 16, max: 25, value: 15.5311481036554 },
    [PuttingDistanceBucket.Putting_26_40]: { min: 26, max: 40, value: 7.11065221132335 },
    [PuttingDistanceBucket.Putting_41_60]: { min: 41, max: 60, value: 3.23278972434695 },
    [PuttingDistanceBucket.Putting_61Plus]: { min: 61, max: Infinity, value: 1.60175879396985 },
};

// Values in feet
const TOUR_AVERAGES_PROXIMITY_PUTTING: Record<MultiRangeValue, RangeValue> = {
    [PuttingDistanceBucket.Putting_16_25]: { min: 16, max: 25, value: 1.751472627 },
    [PuttingDistanceBucket.Putting_26_40]: { min: 26, max: 40, value: 2.464884564 },
    [PuttingDistanceBucket.Putting_41_60]: { min: 41, max: 60, value: 3.826583778 },
    [PuttingDistanceBucket.Putting_61Plus]: { min: 61, max: Infinity, value: 5.877502198 },
};

const TOUR_AVERAGES_APPROACH_PROXIMITY_FAIRWAY: Record<ApproachDistanceBucket, RangeValue> = {
    [ApproachDistanceBucket.Approach_101_150]: { min: 101, max: 150, value: 7.6901261652748 },
    [ApproachDistanceBucket.Approach_151_200]: { min: 151, max: 200, value: 10.939844107196 },
    [ApproachDistanceBucket.Approach_201_250]: { min: 201, max: 250, value: 16.6359404134576 },
    [ApproachDistanceBucket.Approach_251Plus]: { min: 251, max: Infinity, value: 49.147690576877 },
};

const TOUR_AVERAGES_APPROACH_PROXIMITY_ROUGH: Record<ApproachDistanceBucket, RangeValue> = {
    [ApproachDistanceBucket.Approach_101_150]: { min: 101, max: 150, value: 12.6905117036434 },
    [ApproachDistanceBucket.Approach_151_200]: { min: 151, max: 200, value: 17.0683193194976 },
    [ApproachDistanceBucket.Approach_201_250]: { min: 201, max: 250, value: 34.8328104191148 },
    [ApproachDistanceBucket.Approach_251Plus]: { min: 251, max: Infinity, value: 86.136716563786 },
};

const TOUR_AVERAGES_SHORT_GAME_PROXIMITY_FAIRWAY: Record<ShortGameDistanceBucket, RangeValue> = {
    [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25, value: 1.83138660159714 },
    [ShortGameDistanceBucket.ShortGame_26_50]: { min: 26, max: 50, value: 3.78721812275207 },
    [ShortGameDistanceBucket.ShortGame_51_75]: { min: 51, max: 75, value: 5.52673272458044 },
    [ShortGameDistanceBucket.ShortGame_76_100]: { min: 76, max: 100, value: 6.01251418125414 },
};

const TOUR_AVERAGES_SHORT_GAME_PROXIMITY_ROUGH: Record<ShortGameDistanceBucket, RangeValue> = {
    [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25, value: 3.30798335588632 },
    [ShortGameDistanceBucket.ShortGame_26_50]: { min: 26, max: 50, value: 5.47331743208278 },
    [ShortGameDistanceBucket.ShortGame_51_75]: { min: 51, max: 75, value: 8.47208069458631 },
    [ShortGameDistanceBucket.ShortGame_76_100]: { min: 76, max: 100, value: 9.98219757281552 },
};

const TOUR_AVERAGES_SHORT_GAME_PROXIMITY_SAND: Record<ShortGameDistanceBucket, RangeValue> = {
    [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25, value: 3.8076 },
    [ShortGameDistanceBucket.ShortGame_26_50]: { min: 26, max: 50, value: 4.2356414156186 },
    [ShortGameDistanceBucket.ShortGame_51_75]: { min: 51, max: 75, value: 0 },
    [ShortGameDistanceBucket.ShortGame_76_100]: { min: 76, max: 100, value: 0 },
};

const TOUR_AVERAGES_APPROACH_GREEN_HIT_PERCENTAGE_FAIRWAY: Record<
    ApproachDistanceBucket,
    RangeValue
> = {
    [ApproachDistanceBucket.Approach_101_150]: { min: 101, max: 150, value: 78.342935660391 },
    [ApproachDistanceBucket.Approach_151_200]: { min: 151, max: 200, value: 65.2429967876757 },
    [ApproachDistanceBucket.Approach_201_250]: { min: 201, max: 250, value: 44.5775460659848 },
    [ApproachDistanceBucket.Approach_251Plus]: { min: 251, max: Infinity, value: 10.9288336848683 },
};

const TOUR_AVERAGES_APPROACH_GREEN_HIT_PERCENTAGE_ROUGH: Record<
    ApproachDistanceBucket,
    RangeValue
> = {
    [ApproachDistanceBucket.Approach_101_150]: { min: 101, max: 150, value: 57.2848017844469 },
    [ApproachDistanceBucket.Approach_151_200]: { min: 151, max: 200, value: 42.3811207353721 },
    [ApproachDistanceBucket.Approach_201_250]: { min: 201, max: 250, value: 16.9331535349644 },
    [ApproachDistanceBucket.Approach_251Plus]: { min: 251, max: Infinity, value: 3.24553950722175 },
};

const TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_FAIRWAY: Record<
    ShortGameDistanceBucket,
    RangeValue
> = {
    [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25, value: 97.1584861028977 },
    [ShortGameDistanceBucket.ShortGame_26_50]: { min: 26, max: 50, value: 92.650462962963 },
    [ShortGameDistanceBucket.ShortGame_51_75]: { min: 51, max: 75, value: 86.3725973385904 },
    [ShortGameDistanceBucket.ShortGame_76_100]: { min: 76, max: 100, value: 84.9933745583039 },
};

const TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_ROUGH: Record<
    ShortGameDistanceBucket,
    RangeValue
> = {
    [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25, value: 89.35 },
    [ShortGameDistanceBucket.ShortGame_26_50]: { min: 26, max: 50, value: 82.1227250765019 },
    [ShortGameDistanceBucket.ShortGame_51_75]: { min: 51, max: 75, value: 70.7019328585961 },
    [ShortGameDistanceBucket.ShortGame_76_100]: { min: 76, max: 100, value: 66.3280116110305 },
};

const TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_SAND: Record<
    ShortGameDistanceBucket,
    RangeValue
> = {
    [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25, value: 88.76 },
    [ShortGameDistanceBucket.ShortGame_26_50]: { min: 26, max: 50, value: 91.3818288051417 },
    [ShortGameDistanceBucket.ShortGame_51_75]: { min: 51, max: 75, value: 0 },
    [ShortGameDistanceBucket.ShortGame_76_100]: { min: 76, max: 100, value: 0 },
};

const TOUR_AVERAGES_SHORT_GAME_ADJUSTED_HOLE_OUT_PERCENTAGE: Record<
    ShortGameDistanceBucket.ShortGame_0_25,
    RangeValue
> = {
    [ShortGameDistanceBucket.ShortGame_0_25]: { min: 0, max: 25, value: 4.57717327025429 },
};

const TOUR_AVERAGE_TEE_SHOT_DISTANCE = 289.48;

type AverageAdjustedShotCalculatorReturn = {
    calculateAdjustedOnePuttPercentages(): Record<PuttingDistanceBucket, number>;
    calculateAdjustedOnePuttAverages(): Record<PuttingDistanceBucket, number>;
    calculateAdjustedHoleOutPercentages(): Record<ShortGameDistanceBucket.ShortGame_0_25, number>;
    calcAverageAdjustedProximityPutting(): {
        averageAdjustedProximityValue: Record<MultiRangeValue, number>;
        averageAdjustedProximity: Record<MultiRangeValue, number>;
    };
    calculateAverageAdjustedTeeShotDistance(): {
        avgAdjustedTeeShotDistance: number;
        avgAdjustedTeeShotValue: number;
    };
    calcAverageAdjustedApproachProximity(): {
        fairway: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
    };
    calculateAverageAdjustedApproachGreenHitPercentages(): {
        fairway: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
    };
    calculateAverageAdjustedShortGameProximity(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
    };
    calculateAverageAdjustedShortGameGreenHitPercentages(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
    };
    calculateAdjustedHoleOutAverages(): Record<ShortGameDistanceBucket.ShortGame_0_25, number>;
};

export class AverageAdjustedShotCalculator implements AverageAdjustedShotCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
    }

    /**
     * THESE ARE THE DISPLAYED VALUES  @see MainCalculator -> @function calcAnalysisPutting
     * Calculates the adjusted one putt percentage, relative to the PGA Tour average and the error term.
     * @returns The adjusted one putt percentage for the specific distance buckets.
     */
    calculateAdjustedOnePuttPercentages(): Record<string, number> {
        const adjustedOnePuttAverages = this.calculateAdjustedOnePuttAverages();

        const adjustedOnePuttPercentages: Record<string, number> = {};

        for (const range in adjustedOnePuttAverages) {
            const key = range as PuttingDistanceBucket;
            const adjustedOnePuttAveragePercentage = +(adjustedOnePuttAverages[key] * 100) || 0;
            const tourAveragePercentage = +TOUR_AVERAGES_ONE_PUTT[key].value || 0;

            const adjustedOnePuttPercentage = +(
                adjustedOnePuttAveragePercentage + tourAveragePercentage
            ).toFixed(1);

            adjustedOnePuttPercentages[range] = adjustedOnePuttPercentage;
        }

        return adjustedOnePuttPercentages;
    }

    /**
     * Calculates the average of one putt adjusted based on the provided rounds.
     * @returns The average of one putt adjusted in each distance bucket
     */
    calculateAdjustedOnePuttAverages(): Record<PuttingDistanceBucket, number> {
        const averages: Record<PuttingDistanceBucket, number> = {
            [PuttingDistanceBucket.Putting_0_2]: 0,
            [PuttingDistanceBucket.Putting_3_5]: 0,
            [PuttingDistanceBucket.Putting_6_9]: 0,
            [PuttingDistanceBucket.Putting_10_15]: 0,
            [PuttingDistanceBucket.Putting_16_25]: 0,
            [PuttingDistanceBucket.Putting_26_40]: 0,
            [PuttingDistanceBucket.Putting_41_60]: 0,
            [PuttingDistanceBucket.Putting_61Plus]: 0,
        };

        for (const range in TOUR_AVERAGES_ONE_PUTT) {
            const key = range as PuttingDistanceBucket;
            const min = TOUR_AVERAGES_ONE_PUTT[key].min;
            const max = TOUR_AVERAGES_ONE_PUTT[key].max;
            let sum = 0;
            let count = 0;

            for (const round of this.rounds) {
                const { shots } = this.getShotsAndHolesForRound(round);

                for (let i = 0; i < shots.length; i++) {
                    if (shots[i]?.location === ShotLocation.Green) {
                        const currentShot = shots[i];
                        if (!currentShot) continue;
                        const nextShot = this.findNextShotOnSameHole(shots, i);

                        const adjCalc = new AdjustedShotCalculator(currentShot, nextShot);
                        const adjustedOnePutt = adjCalc.calculateAdjustedOnePutt();

                        if (currentShot.distance >= min && currentShot.distance <= max) {
                            sum += adjustedOnePutt;
                            count++;
                        }
                    }
                }
            }

            averages[key] = count > 0 ? sum / count : 0;
        }

        return averages;
    }

    calcAverageAdjustedProximityPutting(): {
        averageAdjustedProximityValue: Record<MultiRangeValue, number>;
        averageAdjustedProximity: Record<MultiRangeValue, number>;
    } {
        const averageAdjustedProximityValue: Record<MultiRangeValue, number> = {
            [PuttingDistanceBucket.Putting_16_25]: 0,
            [PuttingDistanceBucket.Putting_26_40]: 0,
            [PuttingDistanceBucket.Putting_41_60]: 0,
            [PuttingDistanceBucket.Putting_61Plus]: 0,
        };

        const averageAdjustedProximity: Record<MultiRangeValue, number> = {
            [PuttingDistanceBucket.Putting_16_25]: 0,
            [PuttingDistanceBucket.Putting_26_40]: 0,
            [PuttingDistanceBucket.Putting_41_60]: 0,
            [PuttingDistanceBucket.Putting_61Plus]: 0,
        };

        for (const range in TOUR_AVERAGES_PROXIMITY_PUTTING) {
            const key = range as MultiRangeValue;
            const min = TOUR_AVERAGES_PROXIMITY_PUTTING[key].min;
            const max = TOUR_AVERAGES_PROXIMITY_PUTTING[key].max;
            let sumAdjustedProximity = 0;
            let count = 0;

            for (const round of this.rounds) {
                const { shots } = this.getShotsAndHolesForRound(round);

                for (const shot of shots) {
                    if (
                        shot.location === ShotLocation.Green &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);

                        const adjustedProximity = adjCalc.calculateAdjustedProximityPutting();

                        sumAdjustedProximity += adjustedProximity;
                        count++;
                    }
                }
            }

            if (count > 0) {
                const tourAverageProximity = TOUR_AVERAGES_PROXIMITY_PUTTING[key].value;

                averageAdjustedProximityValue[key] = +(sumAdjustedProximity / count);
                averageAdjustedProximity[key] = +(
                    sumAdjustedProximity / count +
                    tourAverageProximity
                ).toFixed(2);
            }
        }

        return { averageAdjustedProximity, averageAdjustedProximityValue };
    }

    calculateAverageAdjustedTeeShotDistance(): {
        avgAdjustedTeeShotDistance: number;
        avgAdjustedTeeShotValue: number;
    } {
        let sumAdjustedTeeShotDistance = 0;
        let count = 0;

        for (const round of this.rounds) {
            const { shots, holes } = this.getShotsAndHolesForRound(round);

            for (const currentShot of shots) {
                const hole = holes.find((h) => h.hole === currentShot.hole);

                if (!hole) {
                    continue;
                }

                if (isOTTShot({ location: currentShot.location, par: hole.par })) {
                    const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(currentShot));

                    const adjCalc = new AdjustedShotCalculator(currentShot, nextShot);

                    const adjustedTeeShotDistance = adjCalc.calculateAdjustedTeeShotDistance();

                    if (!adjustedTeeShotDistance) {
                        continue;
                    }

                    sumAdjustedTeeShotDistance += adjustedTeeShotDistance;
                    count++;
                }
            }
        }

        let avgAdjustedTeeShotDistance = 0;
        let avgAdjustedTeeShotValue = 0;

        if (count > 0) {
            avgAdjustedTeeShotValue = sumAdjustedTeeShotDistance / count;
            avgAdjustedTeeShotDistance = +(
                avgAdjustedTeeShotValue + TOUR_AVERAGE_TEE_SHOT_DISTANCE
            ).toFixed(2);
        }

        return { avgAdjustedTeeShotDistance, avgAdjustedTeeShotValue };
    }

    calcAverageAdjustedApproachProximity(): {
        fairway: Record<ApproachDistanceBucket, number>;
        fairwayValues: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
        roughValues: Record<ApproachDistanceBucket, number>;
    } {
        const fairway: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };
        const rough: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };

        const fairwayValues: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };
        const roughValues: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };

        for (const range in TOUR_AVERAGES_APPROACH_PROXIMITY_FAIRWAY) {
            const key = range as ApproachDistanceBucket;
            const min = TOUR_AVERAGES_APPROACH_PROXIMITY_FAIRWAY[key].min;
            const max = TOUR_AVERAGES_APPROACH_PROXIMITY_FAIRWAY[key].max;
            let sumFairwayTeeApproachProximity = 0;
            let sumRoughApproachProximity = 0;
            let countFairwayTeeApproach = 0;
            let countRoughApproach = 0;

            for (const round of this.rounds) {
                const { shots, holes } = this.getShotsAndHolesForRound(round);

                for (const shot of shots) {
                    const hole = holes.find((h) => h.hole === shot.hole);
                    if (!hole) continue;

                    if (
                        isApproachShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedApproachProximity =
                            adjCalc.calculateAdjustedApproachProximity();

                        sumFairwayTeeApproachProximity += adjustedApproachProximity;

                        if (nextShot?.location !== ShotLocation.Penalty) {
                            countFairwayTeeApproach++;
                        }
                    } else if (
                        isApproachShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedApproachProximity =
                            adjCalc.calculateAdjustedApproachProximity();

                        sumRoughApproachProximity += adjustedApproachProximity;

                        if (nextShot?.location !== ShotLocation.Penalty) {
                            countRoughApproach++;
                        }
                    }
                }
            }

            if (countFairwayTeeApproach > 0) {
                const averageFairwayAdjAppProxValue =
                    sumFairwayTeeApproachProximity / countFairwayTeeApproach;

                fairwayValues[key] = averageFairwayAdjAppProxValue;
                fairway[key] =
                    averageFairwayAdjAppProxValue +
                    TOUR_AVERAGES_APPROACH_PROXIMITY_FAIRWAY[key].value;
            }

            if (countRoughApproach > 0) {
                const averageRoughAdjAppProxValue = sumRoughApproachProximity / countRoughApproach;

                roughValues[key] = averageRoughAdjAppProxValue;
                rough[key] =
                    averageRoughAdjAppProxValue + TOUR_AVERAGES_APPROACH_PROXIMITY_ROUGH[key].value;
            }
        }

        return {
            fairway,
            fairwayValues,
            rough,
            roughValues,
        };
    }

    calculateAverageAdjustedApproachGreenHitPercentages(): {
        fairway: Record<ApproachDistanceBucket, number>;
        fairwayValues: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
        roughValues: Record<ApproachDistanceBucket, number>;
    } {
        const fairway: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };
        const rough: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };

        const fairwayValues: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };
        const roughValues: Record<ApproachDistanceBucket, number> = {
            [ApproachDistanceBucket.Approach_101_150]: 0,
            [ApproachDistanceBucket.Approach_151_200]: 0,
            [ApproachDistanceBucket.Approach_201_250]: 0,
            [ApproachDistanceBucket.Approach_251Plus]: 0,
        };

        for (const range in TOUR_AVERAGES_APPROACH_GREEN_HIT_PERCENTAGE_FAIRWAY) {
            const key = range as ApproachDistanceBucket;
            const min = TOUR_AVERAGES_APPROACH_GREEN_HIT_PERCENTAGE_FAIRWAY[key].min;
            const max = TOUR_AVERAGES_APPROACH_GREEN_HIT_PERCENTAGE_FAIRWAY[key].max;
            let sumFairwayAdjGreenHit = 0;
            let sumRoughAdjGreenHit = 0;
            let countFairwayGreenHit = 0;
            let countRoughGreenHit = 0;

            for (const round of this.rounds) {
                const { shots, holes } = this.getShotsAndHolesForRound(round);

                for (const shot of shots) {
                    const hole = holes.find((h) => h.hole === shot.hole);
                    if (!hole) continue;

                    if (
                        isApproachShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));

                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedGreenHit = adjCalc.calculateAdjustedGreenHit();

                        sumFairwayAdjGreenHit += adjustedGreenHit;
                        countFairwayGreenHit++;
                    } else if (
                        isApproachShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedGreenHit = adjCalc.calculateAdjustedGreenHit();

                        sumRoughAdjGreenHit += adjustedGreenHit;
                        countRoughGreenHit++;
                    }
                }
            }

            if (countFairwayGreenHit > 0) {
                const averageFairwayAdjGreenHitValue = sumFairwayAdjGreenHit / countFairwayGreenHit;

                fairwayValues[key] = averageFairwayAdjGreenHitValue;
                fairway[key] = +(
                    averageFairwayAdjGreenHitValue * 100 +
                    TOUR_AVERAGES_APPROACH_GREEN_HIT_PERCENTAGE_FAIRWAY[key].value
                ).toFixed(2);
            }

            if (countRoughGreenHit > 0) {
                const averageRoughAdjGreenHitValue = sumRoughAdjGreenHit / countRoughGreenHit;

                roughValues[key] = averageRoughAdjGreenHitValue;
                rough[key] = +(
                    averageRoughAdjGreenHitValue * 100 +
                    TOUR_AVERAGES_APPROACH_GREEN_HIT_PERCENTAGE_ROUGH[key].value
                ).toFixed(2);
            }
        }

        return {
            fairway,
            fairwayValues,
            rough,
            roughValues,
        };
    }

    calculateAverageAdjustedShortGameProximity(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
        fairwayValues: Record<ShortGameDistanceBucket, number>;
        roughValues: Record<ShortGameDistanceBucket, number>;
        sandValues: Record<ShortGameDistanceBucket, number>;
    } {
        const fairway: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const rough: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const sand: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const fairwayValues: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const roughValues: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const sandValues: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };

        for (const range in TOUR_AVERAGES_SHORT_GAME_PROXIMITY_FAIRWAY) {
            const key = range as ShortGameDistanceBucket;
            const min = TOUR_AVERAGES_SHORT_GAME_PROXIMITY_FAIRWAY[key].min;
            const max = TOUR_AVERAGES_SHORT_GAME_PROXIMITY_FAIRWAY[key].max;
            let sumFairwayShortGameProx = 0;
            let sumRoughShortGameProx = 0;
            let sumSandShortGameProx = 0;
            let countFairwayShortGame = 0;
            let countRoughShortGame = 0;
            let countSandShortGame = 0;

            for (const round of this.rounds) {
                const { shots, holes } = this.getShotsAndHolesForRound(round);

                for (const shot of shots) {
                    const hole = holes.find((h) => h.hole === shot.hole);
                    if (!hole) continue;

                    if (
                        isShortGameShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedShortGameProx = adjCalc.calculateAdjustedShortGameProximity();

                        sumFairwayShortGameProx += adjustedShortGameProx;

                        if (nextShot?.location !== ShotLocation.Penalty) {
                            countFairwayShortGame++;
                        }
                    } else if (
                        isShortGameShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedShortGameProx = adjCalc.calculateAdjustedShortGameProximity();

                        sumRoughShortGameProx += adjustedShortGameProx;

                        if (nextShot?.location !== ShotLocation.Penalty) {
                            countRoughShortGame++;
                        }
                    } else if (
                        isShortGameShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        shot.location === ShotLocation.Sand &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedShortGameProx = adjCalc.calculateAdjustedShortGameProximity();

                        sumSandShortGameProx += adjustedShortGameProx;

                        if (nextShot?.location !== ShotLocation.Penalty) {
                            countSandShortGame++;
                        }
                    }
                }
            }

            // Calculate averages for each bucket and add tour averages
            let averageFairwayAdjShortGameProxValue = 0;
            if (countFairwayShortGame > 0) {
                const tourAverageProximity = TOUR_AVERAGES_SHORT_GAME_PROXIMITY_FAIRWAY[key].value;
                averageFairwayAdjShortGameProxValue =
                    sumFairwayShortGameProx / countFairwayShortGame;

                fairway[key] = +(
                    averageFairwayAdjShortGameProxValue + tourAverageProximity
                ).toFixed(2);
                fairwayValues[key] = averageFairwayAdjShortGameProxValue;
            }

            let averageRoughAdjShortGameProxValue = 0;
            if (countRoughShortGame > 0) {
                const tourAverageProximity = TOUR_AVERAGES_SHORT_GAME_PROXIMITY_ROUGH[key].value;
                averageRoughAdjShortGameProxValue = sumRoughShortGameProx / countRoughShortGame;

                rough[key] = +(averageRoughAdjShortGameProxValue + tourAverageProximity).toFixed(2);
                roughValues[key] = averageRoughAdjShortGameProxValue;
            }

            let averageSandAdjShortGameProxValue = 0;
            if (countSandShortGame > 0) {
                const tourAverageProximity = TOUR_AVERAGES_SHORT_GAME_PROXIMITY_SAND[key].value;
                averageSandAdjShortGameProxValue = sumSandShortGameProx / countSandShortGame;

                sand[key] = +(averageSandAdjShortGameProxValue + tourAverageProximity).toFixed(2);
                sandValues[key] = averageSandAdjShortGameProxValue;
            }
        }

        return {
            fairway,
            rough,
            sand,
            fairwayValues,
            roughValues,
            sandValues,
        };
    }

    calculateAverageAdjustedShortGameGreenHitPercentages(): {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
        fairwayValues: Record<ShortGameDistanceBucket, number>;
        roughValues: Record<ShortGameDistanceBucket, number>;
        sandValues: Record<ShortGameDistanceBucket, number>;
    } {
        const fairway: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const rough: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const sand: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };

        const fairwayValues: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const roughValues: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };
        const sandValues: Record<ShortGameDistanceBucket, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
            [ShortGameDistanceBucket.ShortGame_26_50]: 0,
            [ShortGameDistanceBucket.ShortGame_51_75]: 0,
            [ShortGameDistanceBucket.ShortGame_76_100]: 0,
        };

        for (const range in TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_FAIRWAY) {
            const key = range as ShortGameDistanceBucket;
            const min = TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_FAIRWAY[key].min;
            const max = TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_FAIRWAY[key].max;
            let sumFairwayGreenHit = 0;
            let sumRoughGreenHit = 0;
            let sumSandGreenHit = 0;
            let countFairwayShortGame = 0;
            let countRoughShortGame = 0;
            let countSandShortGame = 0;

            for (const round of this.rounds) {
                const { shots, holes } = this.getShotsAndHolesForRound(round);

                for (const shot of shots) {
                    const hole = holes.find((h) => h.hole === shot.hole);
                    if (!hole) continue;

                    if (
                        isShortGameShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedGreenHit = adjCalc.calculateAdjustedGreenHit();

                        sumFairwayGreenHit += adjustedGreenHit;
                        countFairwayShortGame++;
                    } else if (
                        isShortGameShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        shot.location === ShotLocation.Rough &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedGreenHit = adjCalc.calculateAdjustedGreenHit();

                        sumRoughGreenHit += adjustedGreenHit;
                        countRoughShortGame++;
                    } else if (
                        isShortGameShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        shot.location === ShotLocation.Sand &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, shots.indexOf(shot));
                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedGreenHit = adjCalc.calculateAdjustedGreenHit();

                        sumSandGreenHit += adjustedGreenHit;
                        countSandShortGame++;
                    }
                }
            }

            // Calculate averages for each bucket and add tour averages
            let averageFairwayGreenHitValue = 0;
            if (countFairwayShortGame > 0) {
                const tourAverageGreenHit =
                    TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_FAIRWAY[key].value;
                averageFairwayGreenHitValue = sumFairwayGreenHit / countFairwayShortGame;

                fairway[key] = +(averageFairwayGreenHitValue * 100 + tourAverageGreenHit).toFixed(
                    2,
                );
                fairwayValues[key] = averageFairwayGreenHitValue;
            }

            let averageRoughGreenHitValue = 0;
            if (countRoughShortGame > 0) {
                const tourAverageGreenHit =
                    TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_ROUGH[key].value;
                averageRoughGreenHitValue = sumRoughGreenHit / countRoughShortGame;

                rough[key] = +(averageRoughGreenHitValue * 100 + tourAverageGreenHit).toFixed(2);
                roughValues[key] = averageRoughGreenHitValue;
            }

            let averageSandGreenHitValue = 0;
            if (countSandShortGame > 0) {
                const tourAverageGreenHit =
                    TOUR_AVERAGES_SHORT_GAME_GREEN_HIT_PERCENTAGE_SAND[key].value;
                averageSandGreenHitValue = sumSandGreenHit / countSandShortGame;

                sand[key] = +(averageSandGreenHitValue * 100 + tourAverageGreenHit).toFixed(2);
                sandValues[key] = averageSandGreenHitValue;
            }
        }

        return {
            fairway,
            rough,
            sand,
            fairwayValues,
            roughValues,
            sandValues,
        };
    }

    calculateAdjustedHoleOutPercentages(): Record<ShortGameDistanceBucket.ShortGame_0_25, number> {
        const adjustedHoleOutAverages = this.calculateAdjustedHoleOutAverages();

        const adjustedHoleOutPercentages: Record<ShortGameDistanceBucket.ShortGame_0_25, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
        };

        for (const range in adjustedHoleOutAverages) {
            // Iterate through the new averages
            const key = range as ShortGameDistanceBucket.ShortGame_0_25;
            const adjustedHoleOutAveragePercentage = adjustedHoleOutAverages[key] * 100 || 0;

            const tourAveragePercentage =
                TOUR_AVERAGES_SHORT_GAME_ADJUSTED_HOLE_OUT_PERCENTAGE[key].value || 0;

            const adjustedHoleOutPercentage = +(
                adjustedHoleOutAveragePercentage + tourAveragePercentage
            ).toFixed(2);

            adjustedHoleOutPercentages[key] = adjustedHoleOutPercentage;
        }

        return adjustedHoleOutPercentages;
    }

    calculateAdjustedHoleOutAverages(): Record<ShortGameDistanceBucket.ShortGame_0_25, number> {
        const averages: Record<ShortGameDistanceBucket.ShortGame_0_25, number> = {
            [ShortGameDistanceBucket.ShortGame_0_25]: 0,
        };

        for (const range in TOUR_AVERAGES_SHORT_GAME_ADJUSTED_HOLE_OUT_PERCENTAGE) {
            const key = range as ShortGameDistanceBucket.ShortGame_0_25;
            const min = TOUR_AVERAGES_SHORT_GAME_ADJUSTED_HOLE_OUT_PERCENTAGE[key].min;
            const max = TOUR_AVERAGES_SHORT_GAME_ADJUSTED_HOLE_OUT_PERCENTAGE[key].max;
            let sum = 0;
            let count = 0;

            for (const round of this.rounds) {
                const { shots, holes } = this.getShotsAndHolesForRound(round);

                for (let i = 0; i < shots.length; i++) {
                    const shot = shots[i];
                    if (!shot) continue;
                    const hole = holes.find((h) => h.hole === shot.hole);
                    if (!hole) continue;

                    if (
                        isShortGameShot({
                            location: shot.location,
                            distance: shot.distance,
                            par: hole.par,
                        }) &&
                        // Only count shots from the fairway, this can be modified later if needed
                        (shot.location === ShotLocation.Fairway ||
                            shot.location === ShotLocation.Tee) &&
                        shot.distance >= min &&
                        shot.distance <= max
                    ) {
                        const nextShot = this.findNextShotOnSameHole(shots, i);

                        const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                        const adjustedOnePutt = adjCalc.calculateAdjustedHoleOut();

                        sum += adjustedOnePutt;
                        count++;
                    }
                }
            }

            averages[key] = count > 0 ? sum / count : 0;
        }
        return averages;
    }

    /** @private Utils | Extract if needed elsewhere */

    private findNextShotOnSameHole(shots: Shot[], currentIndex: number): Shot | undefined {
        const currentHole = shots[currentIndex]?.hole;
        for (let i = currentIndex + 1; i < shots.length; i++) {
            if (shots[i]?.hole === currentHole) {
                return shots[i];
            }
        }
        return undefined;
    }

    private getShotsAndHolesForRound(round: Round): { shots: Shot[]; holes: Hole[] } {
        const shots = this.shots.find((el) => el[0]?.roundId === round.id) ?? [];
        const holes = this.holes.find((el) => el[0]?.roundId === round.id) ?? [];
        return { shots, holes };
    }
}
