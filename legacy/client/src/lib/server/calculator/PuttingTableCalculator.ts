import { ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { AdjustedShotCalculator } from "./AdjustedShotCalculator";
import { StrokesGainedCalculator, type ShotStrokesGained } from "./StrokesGainedCalculator";

export type PuttingTableData = {
    distanceRange: string;
    sgPerRound: number;
    sgPerShot: number;
    onePutt: number;
    twoPutt: number;
    threePutt: number;
    // avgProximity: number;
    frequency: number;
    totalShots: number;
    shotsPerRound: number;
};

type PuttingTableCalculatorReturn = {
    calcAverageStrokesGainedForDistances(): {
        averageStrokesGainedPerRoundForDistances: Record<string, number>;
        averageStrokesGainedPerShotForDistances: Record<string, number>;
    };
    calcAveragePuttingProximityForDistances(): Record<string, number>;
    calcFrequencyPuttingForDistances(): Record<string, number>;
    getTotalPuttsForDistances(): Record<string, number>;
    calcPuttsPerRoundForDistances(): Record<string, number>;
    getAllPuttingTableData(): PuttingTableData[];
};

export class PuttingTableCalculator implements PuttingTableCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
    }

    distanceBuckets: {
        label: string;
        min: number;
        max: number;
    }[] = [
        { label: "0-2", min: 0, max: 2 },
        { label: "3-5", min: 3, max: 5 },
        { label: "6-9", min: 6, max: 9 },
        { label: "10-15", min: 10, max: 15 },
        { label: "16-25", min: 16, max: 25 },
        { label: "26-40", min: 26, max: 50 },
        { label: "41-60", min: 41, max: 60 },
        { label: "61+", min: 61, max: Infinity },
    ];

    private getPuttsForRounds(): {
        numberOfHolesForRound: number;
        putts: ShotStrokesGained[];
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
                    putts: [],
                };
            }

            const calculator = new StrokesGainedCalculator(round, shots, holes);
            const { putts } = calculator.calcStrokesGainedPerRound();

            const numberOfHoles = holes.length;
            const numberOfPutts = putts.length;

            return {
                numberOfHolesForRound: numberOfHoles,
                numberOfPuttsForRound: numberOfPutts,
                putts,
            };
        });

        return roundStats.filter(Boolean);
    }

    private getPuttsInDistanceBuckets(): Record<string, ShotStrokesGained[]> {
        const roundStats = this.getPuttsForRounds();

        const shotsForEachDistance: Record<string, ShotStrokesGained[]> = {};

        this.distanceBuckets.forEach((bucket) => {
            shotsForEachDistance[bucket.label] = roundStats.flatMap((round) =>
                round.putts.filter(
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
        const distanceStats = this.getPuttsInDistanceBuckets();
        let totalHolesForAllRounds = 0;

        for (const round of this.getPuttsForRounds()) {
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

            const numberOfPutts = shots.length;
            const averageStrokesGainedPerShot =
                numberOfPutts === 0 ? 0 : totalStrokesGained / numberOfPutts;
            averageStrokesGainedPerShotForDistances[distanceRange] =
                +averageStrokesGainedPerShot.toFixed(3);
        }

        return {
            averageStrokesGainedPerRoundForDistances,
            averageStrokesGainedPerShotForDistances,
        };
    }

    calcAveragePuttingProximityForDistances(): Record<string, number> {
        const distanceStats = this.getPuttsInDistanceBuckets();
        const puttingProximityForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const putts = distanceStats[distanceRange] ?? [];
            let totalProximity = 0;
            let puttCount = 0;

            for (const putt of putts) {
                const roundId = putt.roundId;
                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
                const shotsForHole = shotsForRound.filter((el) => el.hole === putt.hole);

                const shotIndex = shotsForHole.findIndex((el) => el.id === putt.id);

                if (shotIndex === -1) {
                    continue;
                }

                // Skip penalty shots
                if (putt.location === ShotLocation.Penalty) {
                    continue;
                }

                const nextShot = shotsForHole[shotIndex + 1];

                if (nextShot) {
                    const adjCalc = new AdjustedShotCalculator(putt, nextShot);
                    totalProximity += adjCalc.calculateAdjustedProximityPutting();
                }

                puttCount++;
            }

            if (puttCount > 0) {
                const averagePuttingProximity = totalProximity / puttCount;
                puttingProximityForDistances[distanceRange] = +averagePuttingProximity.toFixed(2);
            } else {
                puttingProximityForDistances[distanceRange] = 0;
            }
        }

        return puttingProximityForDistances;
    }

    // ONE PUTT
    calcOnePuttPercentageForDistances(): Record<string, number> {
        const distanceStats = this.getPuttsInDistanceBuckets();

        const onePuttPercentageForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const putts = distanceStats[distanceRange] ?? [];
            let onePuttCount = 0;

            for (const putt of putts) {
                const roundId = putt.roundId;
                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
                const shotsForHole = shotsForRound.filter((el) => el.hole === putt.hole);

                const shotIndex = shotsForHole.findIndex((el) => el.id === putt.id);

                if (shotIndex === -1) {
                    continue;
                }

                const nextShot = shotsForHole[shotIndex + 1];

                if (!nextShot) {
                    onePuttCount++;
                }
            }

            const numberOfPutts = putts.length;
            const onePuttPercentage =
                numberOfPutts === 0 ? 0 : (onePuttCount / numberOfPutts) * 100;
            onePuttPercentageForDistances[distanceRange] = Math.round(onePuttPercentage);
        }

        return onePuttPercentageForDistances;
    }

    // TWO PUTT
    calcTwoPuttPercentageForDistances(): Record<string, number> {
        const distanceStats = this.getPuttsInDistanceBuckets();

        const twoPuttPercentageForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const putts = distanceStats[distanceRange] ?? [];
            let twoPuttCount = 0;

            for (const putt of putts) {
                const roundId = putt.roundId;
                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
                const shotsForHole = shotsForRound.filter((el) => el.hole === putt.hole);

                const shotIndex = shotsForHole.findIndex((el) => el.id === putt.id);

                if (shotIndex === -1) {
                    continue;
                }

                const nextShot = shotsForHole[shotIndex + 1];
                const nextNextShot = shotsForHole[shotIndex + 2];

                if (nextShot && !nextNextShot) {
                    twoPuttCount++;
                }
            }

            const numberOfPutts = putts.length;
            const twoPuttPercentage =
                numberOfPutts === 0 ? 0 : (twoPuttCount / numberOfPutts) * 100;
            twoPuttPercentageForDistances[distanceRange] = Math.round(twoPuttPercentage);
        }

        return twoPuttPercentageForDistances;
    }

    // THREE PUTT
    calcThreePuttPercentageForDistances(): Record<string, number> {
        const distanceStats = this.getPuttsInDistanceBuckets();

        const threePuttPercentageForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const putts = distanceStats[distanceRange] ?? [];
            let threePuttCount = 0;

            for (const putt of putts) {
                const roundId = putt.roundId;
                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
                const shotsForHole = shotsForRound.filter((el) => el.hole === putt.hole);

                const shotIndex = shotsForHole.findIndex((el) => el.id === putt.id);

                if (shotIndex === -1) {
                    continue;
                }

                const nextShot = shotsForHole[shotIndex + 1];
                const nextNextShot = shotsForHole[shotIndex + 2];
                const nextNextNextShot = shotsForHole[shotIndex + 3];

                if (nextShot && nextNextShot && !nextNextNextShot) {
                    threePuttCount++;
                }
            }

            const numberOfPutts = putts.length;
            const threePuttPercentage =
                numberOfPutts === 0 ? 0 : (threePuttCount / numberOfPutts) * 100;
            threePuttPercentageForDistances[distanceRange] = Math.round(threePuttPercentage);
        }

        return threePuttPercentageForDistances;
    }

    calcFrequencyPuttingForDistances(): Record<string, number> {
        const distanceStats = this.getPuttsInDistanceBuckets();
        let totalPuttsForAllDistances = 0;

        for (const putts of Object.values(distanceStats)) {
            totalPuttsForAllDistances += putts.length;
        }

        const frequencyPuttingForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const putts = distanceStats[distanceRange] ?? [];
            const totalPuttsForDistance = putts.length;
            const frequency =
                totalPuttsForAllDistances === 0
                    ? 0
                    : (totalPuttsForDistance / totalPuttsForAllDistances) * 100;
            frequencyPuttingForDistances[distanceRange] = Math.round(frequency);
        }

        return frequencyPuttingForDistances;
    }

    getTotalPuttsForDistances(): Record<string, number> {
        const distanceStats = this.getPuttsInDistanceBuckets();
        const totalPuttsForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const putts = distanceStats[distanceRange] ?? [];
            totalPuttsForDistances[distanceRange] = putts.length;
        }

        return totalPuttsForDistances;
    }

    calcPuttsPerRoundForDistances(): Record<string, number> {
        const roundStats = this.getPuttsForRounds();
        let totalHolesForAllRounds = 0;

        for (const round of roundStats) {
            totalHolesForAllRounds += round.numberOfHolesForRound;
        }

        const distanceStats = this.getPuttsInDistanceBuckets();

        const puttsPerRoundForDistances: Record<string, number> = {};

        for (const distanceRange of Object.keys(distanceStats)) {
            const putts = distanceStats[distanceRange] ?? [];
            const totalPuttsForDistance = putts.length;
            const puttsPerRound =
                totalHolesForAllRounds === 0
                    ? 0
                    : totalPuttsForDistance / (totalHolesForAllRounds / 18);
            puttsPerRoundForDistances[distanceRange] = +puttsPerRound.toFixed(2);
        }

        return puttsPerRoundForDistances;
    }

    getAllPuttingTableData(): PuttingTableData[] {
        const distanceStats = this.getPuttsInDistanceBuckets();
        const totalShotsForDistances = this.getTotalPuttsForDistances();
        // const averagePuttingProximityForDistances = this.calcAveragePuttingProximityForDistances();
        const shotsPerRoundForDistances = this.calcPuttsPerRoundForDistances();
        const frequencyPuttingForDistances = this.calcFrequencyPuttingForDistances();
        const averageStrokesGainedPerRoundForDistances =
            this.calcAverageStrokesGainedForDistances().averageStrokesGainedPerRoundForDistances;
        const averageStrokesGainedPerShotForDistances =
            this.calcAverageStrokesGainedForDistances().averageStrokesGainedPerShotForDistances;
        const onePuttForDistances = this.calcOnePuttPercentageForDistances();
        const twoPuttForDistances = this.calcTwoPuttPercentageForDistances();
        const threePuttForDistances = this.calcThreePuttPercentageForDistances();

        const tableData: PuttingTableData[] = [];

        for (const distanceRange of Object.keys(distanceStats)) {
            const sgPerRound = averageStrokesGainedPerRoundForDistances[distanceRange] ?? 0;
            const sgPerShot = averageStrokesGainedPerShotForDistances[distanceRange] ?? 0;
            const onePutt = onePuttForDistances[distanceRange] ?? 0;
            const twoPutt = twoPuttForDistances[distanceRange] ?? 0;
            const threePutt = threePuttForDistances[distanceRange] ?? 0;
            // const avgProximity = averagePuttingProximityForDistances[distanceRange] ?? 0;
            const totalShots = totalShotsForDistances[distanceRange] ?? 0;
            const frequency = frequencyPuttingForDistances[distanceRange] ?? 0;
            const shotsPerRound = shotsPerRoundForDistances[distanceRange] ?? 0;

            const tableRow: PuttingTableData = {
                distanceRange,
                sgPerRound,
                sgPerShot,
                onePutt,
                twoPutt,
                threePutt,
                // avgProximity,
                totalShots,
                frequency,
                shotsPerRound,
            };

            tableData.push(tableRow);
        }

        return tableData;
    }
}
