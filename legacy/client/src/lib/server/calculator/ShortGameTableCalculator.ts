import { ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { AdjustedShotCalculator } from "./AdjustedShotCalculator";
import { StrokesGainedCalculator, type ShotStrokesGained } from "./StrokesGainedCalculator";

export type ShortGameTableData = {
    distanceRange: string;
    sgPerRound: number;
    sgPerShot: number;
    // avgProximity: number;
    greenHit: number;
    poorShortGameShots: number;
    greatShortGameShots: number;
    frequency: number;
    totalShots: number;
    shotsPerRound: number;
};

type ShortGameTableCalculatorReturn = {
    calcAverageStrokesGainedForDistances(): {
        averageStrokesGainedPerRoundForDistances: Record<string, number>;
        averageStrokesGainedPerShotForDistances: Record<string, number>;
    };
    calcAverageShortGameProximityForDistances(): Record<string, number>;
    calcGreenAccuracyForDistances(): Record<string, number>;
    calcPoorShortGameShotsForDistances(): Record<string, number>;
    calcGreatShortGameShotsForDistances(): Record<string, number>;
    calcFrequencyShortGameForDistances(): Record<string, number>;
    getTotalShotsForDistances(): Record<string, number>;
    calcShotsPerRoundForDistances(): Record<string, number>;
    getAllShortGameTableData(): ShortGameTableData[];
};

export class ShortGameTableCalculator implements ShortGameTableCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
    }

    private getShortGameShotsForRounds(): {
        numberOfHolesForRound: number;
        shortGameShots: ShotStrokesGained[];
    }[] {
        const roundStats = this.rounds.map((round, i) => {
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
                    shortGameShots: [],
                };
            }

            const calculator = new StrokesGainedCalculator(round, shots, holes);
            const { shortGameShots } = calculator.calcStrokesGainedPerRound();

            const numberOfHoles = holes.length;
            const numberOfShortGameShots = shortGameShots.length;

            return {
                numberOfHolesForRound: numberOfHoles,
                numberOfShortGameShotsForRound: numberOfShortGameShots,
                shortGameShots: shortGameShots,
            };
        });

        return roundStats.filter(Boolean);
    }

    private getShortGameShotsInDistanceBuckets(): Record<string, ShotStrokesGained[]> {
        const distanceBuckets = [
            { label: "0-20", min: 0, max: 20 },
            { label: "21-40", min: 21, max: 40 },
            { label: "41-60", min: 41, max: 60 },
            { label: "61-80", min: 61, max: 80 },
            { label: "81-100", min: 81, max: 100 },
        ];

        const roundStats = this.getShortGameShotsForRounds();

        const shotsForEachDistance: Record<string, ShotStrokesGained[]> = {};

        distanceBuckets.forEach((bucket) => {
            shotsForEachDistance[bucket.label] = roundStats.flatMap((round) =>
                round.shortGameShots.filter(
                    (shot) => shot.distance >= bucket.min && shot.distance <= bucket.max,
                ),
            );
        });

        return shotsForEachDistance;
    }

    calcAverageStrokesGainedForDistances(): {
        averageStrokesGainedPerRoundForDistances: Record<string, number>;
        averageStrokesGainedPerShotForDistances: Record<string, number>;
    } {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        let totalHolesForAllRounds = 0;

        for (const round of this.getShortGameShotsForRounds()) {
            totalHolesForAllRounds += round.numberOfHolesForRound;
        }

        const averageStrokesGainedPerRoundForDistances: Record<string, number> = {};
        const averageStrokesGainedPerShotForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            let totalStrokesGained = 0;

            for (const shot of shots) {
                totalStrokesGained += shot.strokesGained;
            }

            const averageStrokesGainedPerRound = totalStrokesGained / (totalHolesForAllRounds / 18);
            averageStrokesGainedPerRoundForDistances[distanceRange] =
                +averageStrokesGainedPerRound.toFixed(3) || 0;

            const numberOfShortGameShots = shots.length;
            const averageStrokesGainedPerShot =
                numberOfShortGameShots === 0 ? 0 : totalStrokesGained / numberOfShortGameShots;
            averageStrokesGainedPerShotForDistances[distanceRange] =
                +averageStrokesGainedPerShot.toFixed(3);
        }

        return {
            averageStrokesGainedPerRoundForDistances,
            averageStrokesGainedPerShotForDistances,
        };
    }

    calcAverageShortGameProximityForDistances(): Record<string, number> {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        const shortGameProximityForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            let totalProximity = 0;
            let shotCount = 0;

            for (const shot of shots) {
                const roundId = shot.roundId;
                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
                const shotIndex = shotsForRound.findIndex((el) => el.id === shot.id);

                if (shotIndex === -1) {
                    continue;
                }

                // Skip penalty shots
                if (shot.location === ShotLocation.Penalty) {
                    continue;
                }

                const nextShot = shotsForRound[shotIndex + 1];

                if (nextShot) {
                    const adjCalc = new AdjustedShotCalculator(shot, nextShot);
                    totalProximity += adjCalc.calculateAdjustedShortGameProximity();
                }

                shotCount++;
            }

            if (shotCount > 0) {
                const averageShortGameProximity = totalProximity / shotCount;
                shortGameProximityForDistances[distanceRange] =
                    +averageShortGameProximity.toFixed(2);
            } else {
                shortGameProximityForDistances[distanceRange] = 0;
            }
        }

        return shortGameProximityForDistances;
    }

    private isOnGreenOrHoled(nextShot: Shot | undefined): boolean {
        if (!nextShot) {
            return true;
        }

        if (nextShot.location === ShotLocation.Green) {
            return true;
        }

        return false;
    }

    calcGreenAccuracyForDistances(): Record<string, number> {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        const greenAccuracyForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            let numGreenHits = 0;
            let totalShots = 0;

            for (const shot of shots) {
                const roundId = shot.roundId;

                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];

                const shotIndex = shotsForRound.findIndex((el) => el.id === shot.id);

                if (shotIndex === -1) {
                    continue;
                }

                const nextShot = shotsForRound[shotIndex + 1];

                if (this.isOnGreenOrHoled(nextShot)) {
                    numGreenHits++;
                }

                totalShots++;
            }

            const greenHitPercentage = totalShots === 0 ? 0 : (numGreenHits / totalShots) * 100;
            greenAccuracyForDistances[distanceRange] = +greenHitPercentage.toFixed(2);
        }

        return greenAccuracyForDistances;
    }

    calcPoorShortGameShotsForDistances(): Record<string, number> {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        const poorShortGameShotsForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            const totalShots = shots.length;
            let poorShortGameShots = 0;

            for (const shot of shots) {
                if (shot.strokesGained <= -0.5) {
                    poorShortGameShots++;
                }
            }

            const poorShotPercentage =
                totalShots === 0 ? 0 : (poorShortGameShots / totalShots) * 100;
            poorShortGameShotsForDistances[distanceRange] = +poorShotPercentage.toFixed(2);
        }

        return poorShortGameShotsForDistances;
    }

    calcGreatShortGameShotsForDistances(): Record<string, number> {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        const greatShortGameShotsForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            const totalShots = shots.length;
            let greatShortGameShots = 0;

            for (const shot of shots) {
                if (shot.strokesGained >= 0.5) {
                    greatShortGameShots++;
                }
            }

            const greatShotPercentage =
                totalShots === 0 ? 0 : (greatShortGameShots / totalShots) * 100;
            greatShortGameShotsForDistances[distanceRange] = +greatShotPercentage.toFixed(2);
        }

        return greatShortGameShotsForDistances;
    }

    calcFrequencyShortGameForDistances(): Record<string, number> {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        let totalShotsForAllDistances = 0;

        for (const shots of Object.values(distanceStats)) {
            totalShotsForAllDistances += shots.length;
        }

        const frequencyShortGameForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            const totalShotsForDistance = shots.length;
            const frequency =
                totalShotsForAllDistances === 0
                    ? 0
                    : (totalShotsForDistance / totalShotsForAllDistances) * 100;
            frequencyShortGameForDistances[distanceRange] = Math.round(frequency);
        }

        return frequencyShortGameForDistances;
    }

    getTotalShotsForDistances(): Record<string, number> {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        const totalShotsForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            totalShotsForDistances[distanceRange] = shots.length;
        }

        return totalShotsForDistances;
    }

    calcShotsPerRoundForDistances(): Record<string, number> {
        const roundStats = this.getShortGameShotsForRounds();
        let totalHolesForAllRounds = 0;

        for (const round of roundStats) {
            totalHolesForAllRounds += round.numberOfHolesForRound;
        }

        const distanceStats = this.getShortGameShotsInDistanceBuckets();

        const shotsPerRoundForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            const totalShotsForDistance = shots.length;
            const shotsPerRound =
                totalHolesForAllRounds === 0
                    ? 0
                    : totalShotsForDistance / (totalHolesForAllRounds / 18);
            shotsPerRoundForDistances[distanceRange] = +shotsPerRound.toFixed(2);
        }

        return shotsPerRoundForDistances;
    }

    getAllShortGameTableData(): ShortGameTableData[] {
        const distanceStats = this.getShortGameShotsInDistanceBuckets();
        const totalShotsForDistances = this.getTotalShotsForDistances();
        // const shortGameProximityForDistances = this.calcAverageShortGameProximityForDistances();
        const greenAccuracyForDistances = this.calcGreenAccuracyForDistances();
        const poorShortGameShotsForDistances = this.calcPoorShortGameShotsForDistances();
        const greatShortGameShotsForDistances = this.calcGreatShortGameShotsForDistances();
        const shotsPerRoundForDistances = this.calcShotsPerRoundForDistances();
        const frequencyShortGameForDistances = this.calcFrequencyShortGameForDistances();
        const averageStrokesGainedPerRoundForDistances =
            this.calcAverageStrokesGainedForDistances().averageStrokesGainedPerRoundForDistances;
        const averageStrokesGainedPerShotForDistances =
            this.calcAverageStrokesGainedForDistances().averageStrokesGainedPerShotForDistances;

        const tableData: ShortGameTableData[] = [];

        for (const distanceRange of Object.keys(distanceStats)) {
            const sgPerRound = averageStrokesGainedPerRoundForDistances[distanceRange] ?? 0;
            const sgPerShot = averageStrokesGainedPerShotForDistances[distanceRange] ?? 0;
            // const avgProximity = shortGameProximityForDistances[distanceRange] ?? 0;
            const greenHit = greenAccuracyForDistances[distanceRange] ?? 0;
            const poorShortGameShots = poorShortGameShotsForDistances[distanceRange] ?? 0;
            const greatShortGameShots = greatShortGameShotsForDistances[distanceRange] ?? 0;
            const totalShots = totalShotsForDistances[distanceRange] ?? 0;
            const frequency = frequencyShortGameForDistances[distanceRange] ?? 0;
            const shotsPerRound = shotsPerRoundForDistances[distanceRange] ?? 0;

            const tableRow: ShortGameTableData = {
                distanceRange,
                sgPerRound,
                sgPerShot,
                // avgProximity,
                greenHit,
                poorShortGameShots,
                greatShortGameShots,
                totalShots,
                frequency,
                shotsPerRound,
            };

            tableData.push(tableRow);
        }

        return tableData;
    }
}
