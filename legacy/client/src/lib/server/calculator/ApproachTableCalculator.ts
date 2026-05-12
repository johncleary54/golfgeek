import { ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { AdjustedShotCalculator } from "./AdjustedShotCalculator";
import { StrokesGainedCalculator, type ShotStrokesGained } from "./StrokesGainedCalculator";

export type ApproachTableData = {
    distanceRange: string;
    sgPerRound: number;
    sgPerShot: number;
    // avgProximity: number;
    greenHit: number;
    poorApproachShots: number;
    greatApproachShots: number;
    frequency: number;
    totalShots: number;
    shotsPerRound: number;
};

type ApproachTableCalculatorReturn = {
    calcAverageStrokesGainedForDistances(): {
        averageStrokesGainedPerRoundForDistances: Record<string, number>;
        averageStrokesGainedPerShotForDistances: Record<string, number>;
    };
    calcAverageApproachProximityForDistances(): Record<string, number>;
    calcGreenAccuracyForDistances(): Record<string, number>;
    calcPoorApproachShotsForDistances(): Record<string, number>;
    calcGreatApproachShotsForDistances(): Record<string, number>;
    calcFrequencyApproachForDistances(): Record<string, number>;
    getTotalShotsForDistances(): Record<string, number>;
    calcShotsPerRoundForDistances(): Record<string, number>;
    getAllApproachTableData(): ApproachTableData[];
};

export class ApproachTableCalculator implements ApproachTableCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
    }

    private getApproachShotsForRounds(): {
        numberOfHolesForRound: number;
        approachShots: ShotStrokesGained[];
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
                    approachShots: [],
                };
            }

            const calculator = new StrokesGainedCalculator(round, shots, holes);
            const { approachShots } = calculator.calcStrokesGainedPerRound();

            const numberOfHoles = holes.length;
            const numberOfApproachShots = approachShots.length;

            return {
                numberOfHolesForRound: numberOfHoles,
                numberOfOTTShotsForRound: numberOfApproachShots,
                approachShots,
            };
        });

        return roundStats.filter(Boolean);
    }

    private getApproachShotsInDistanceBuckets(): Record<string, ShotStrokesGained[]> {
        const distanceBuckets = [
            { label: "101-125", min: 101, max: 125 },
            { label: "126-150", min: 126, max: 150 },
            { label: "151-175", min: 151, max: 175 },
            { label: "176-200", min: 176, max: 200 },
            { label: "201-225", min: 201, max: 225 },
            { label: "226-250", min: 226, max: 250 },
            { label: "251-275", min: 251, max: 275 },
            { label: "276-300", min: 276, max: 300 },
            { label: "300+", min: 301, max: Infinity },
        ];

        const roundStats = this.getApproachShotsForRounds();

        const shotsForEachDistance: Record<string, ShotStrokesGained[]> = {};

        distanceBuckets.forEach((bucket) => {
            shotsForEachDistance[bucket.label] = roundStats.flatMap((round) =>
                round.approachShots.filter(
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
        const distanceStats = this.getApproachShotsInDistanceBuckets();
        let totalHolesForAllRounds = 0;

        for (const round of this.getApproachShotsForRounds()) {
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

            const numberOfApproachShots = shots.length;
            const averageStrokesGainedPerShot =
                numberOfApproachShots === 0 ? 0 : totalStrokesGained / numberOfApproachShots;
            averageStrokesGainedPerShotForDistances[distanceRange] =
                +averageStrokesGainedPerShot.toFixed(3);
        }

        return {
            averageStrokesGainedPerRoundForDistances,
            averageStrokesGainedPerShotForDistances,
        };
    }

    calcAverageApproachProximityForDistances(): Record<string, number> {
        const distanceStats = this.getApproachShotsInDistanceBuckets();
        const approachProximityForDistances: Record<string, number> = {};

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
                    totalProximity += adjCalc.calculateAdjustedApproachProximity();
                }

                shotCount++;
            }

            if (shotCount > 0) {
                const averageApproachProximity = totalProximity / shotCount;
                approachProximityForDistances[distanceRange] = +averageApproachProximity.toFixed(2);
            } else {
                approachProximityForDistances[distanceRange] = 0;
            }
        }

        return approachProximityForDistances;
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
        const distanceStats = this.getApproachShotsInDistanceBuckets();
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

    calcPoorApproachShotsForDistances(): Record<string, number> {
        const distanceStats = this.getApproachShotsInDistanceBuckets();
        const poorApproachShotsForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            const totalShots = shots.length;
            let poorApproachShots = 0;

            for (const shot of shots) {
                if (shot.strokesGained <= -0.5) {
                    poorApproachShots++;
                }
            }

            const poorShotPercentage =
                totalShots === 0 ? 0 : (poorApproachShots / totalShots) * 100;
            poorApproachShotsForDistances[distanceRange] = +poorShotPercentage.toFixed(2);
        }

        return poorApproachShotsForDistances;
    }

    calcGreatApproachShotsForDistances(): Record<string, number> {
        const distanceStats = this.getApproachShotsInDistanceBuckets();
        const greatApproachShotsForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            const totalShots = shots.length;
            let greatApproachShots = 0;

            for (const shot of shots) {
                if (shot.strokesGained >= 0.5) {
                    greatApproachShots++;
                }
            }

            const greatShotPercentage =
                totalShots === 0 ? 0 : (greatApproachShots / totalShots) * 100;
            greatApproachShotsForDistances[distanceRange] = +greatShotPercentage.toFixed(2);
        }

        return greatApproachShotsForDistances;
    }

    calcFrequencyApproachForDistances(): Record<string, number> {
        const distanceStats = this.getApproachShotsInDistanceBuckets();
        let totalShotsForAllDistances = 0;

        for (const shots of Object.values(distanceStats)) {
            totalShotsForAllDistances += shots.length;
        }

        const frequencyApproachForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            const totalShotsForDistance = shots.length;
            const frequency =
                totalShotsForAllDistances === 0
                    ? 0
                    : (totalShotsForDistance / totalShotsForAllDistances) * 100;
            frequencyApproachForDistances[distanceRange] = Math.round(frequency);
        }

        return frequencyApproachForDistances;
    }

    getTotalShotsForDistances(): Record<string, number> {
        const distanceStats = this.getApproachShotsInDistanceBuckets();
        const totalShotsForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const shots = distanceStats[distanceRange] ?? [];
            totalShotsForDistances[distanceRange] = shots.length;
        }

        return totalShotsForDistances;
    }

    calcShotsPerRoundForDistances(): Record<string, number> {
        const roundStats = this.getApproachShotsForRounds();
        let totalHolesForAllRounds = 0;

        for (const round of roundStats) {
            totalHolesForAllRounds += round.numberOfHolesForRound;
        }

        const distanceStats = this.getApproachShotsInDistanceBuckets();

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

    getAllApproachTableData(): ApproachTableData[] {
        const distanceStats = this.getApproachShotsInDistanceBuckets();
        const totalShotsForDistances = this.getTotalShotsForDistances();
        // const approachProximityForDistances = this.calcAverageApproachProximityForDistances();
        const greenAccuracyForDistances = this.calcGreenAccuracyForDistances();
        const poorApproachShotsForDistances = this.calcPoorApproachShotsForDistances();
        const greatApproachShotsForDistances = this.calcGreatApproachShotsForDistances();
        const shotsPerRoundForDistances = this.calcShotsPerRoundForDistances();
        const frequencyApproachForDistances = this.calcFrequencyApproachForDistances();
        const averageStrokesGainedPerRoundForDistances =
            this.calcAverageStrokesGainedForDistances().averageStrokesGainedPerRoundForDistances;
        const averageStrokesGainedPerShotForDistances =
            this.calcAverageStrokesGainedForDistances().averageStrokesGainedPerShotForDistances;

        const tableData: ApproachTableData[] = [];

        for (const distanceRange of Object.keys(distanceStats)) {
            const sgPerRound = averageStrokesGainedPerRoundForDistances[distanceRange] ?? 0;
            const sgPerShot = averageStrokesGainedPerShotForDistances[distanceRange] ?? 0;
            // const avgProximity = approachProximityForDistances[distanceRange] ?? 0;
            const greenHit = greenAccuracyForDistances[distanceRange] ?? 0;
            const poorApproachShots = poorApproachShotsForDistances[distanceRange] ?? 0;
            const greatApproachShots = greatApproachShotsForDistances[distanceRange] ?? 0;
            const totalShots = totalShotsForDistances[distanceRange] ?? 0;
            const frequency = frequencyApproachForDistances[distanceRange] ?? 0;
            const shotsPerRound = shotsPerRoundForDistances[distanceRange] ?? 0;

            const tableRow: ApproachTableData = {
                distanceRange,
                sgPerRound,
                sgPerShot,
                // avgProximity,
                greenHit,
                poorApproachShots,
                greatApproachShots,
                totalShots,
                frequency,
                shotsPerRound,
            };

            tableData.push(tableRow);
        }

        return tableData;
    }
}
