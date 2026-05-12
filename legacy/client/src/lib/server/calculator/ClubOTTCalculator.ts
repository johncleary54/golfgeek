import { ShotClub, ShotLocation } from "$lib/types";
import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { AdjustedShotCalculator } from "./AdjustedShotCalculator";
import { StrokesGainedCalculator, type ShotStrokesGained } from "./StrokesGainedCalculator";

export type OTTShotClub =
    | ShotClub.None
    | ShotClub.Driver
    | ShotClub.Wood3
    | ShotClub.Iron3
    | ShotClub.Iron4
    | ShotClub.Iron5
    | ShotClub.Iron6
    | ShotClub.Iron7;

export type OTTTableData = {
    club: OTTShotClub | string;
    sgPerRound: number;
    sgPerShot: number;
    // avgDistance: number;
    fairwayAccuracy: number;
    poorTeeShots: number;
    // greatTeeShots: number;
    frequency: number;
    totalShots: number;
    shotsPerRound: number;
};

type ClubOTTCalculatorReturn = {
    calcAverageStrokesGainedForClubs(): {
        averageStrokesGainedPerRoundForClubs: Record<OTTShotClub, number>;
        averageStrokesGainedPerShotForClubs: Record<OTTShotClub, number>;
    };
    calcFairwayAccuracyForClubs(): Record<OTTShotClub, number>;
    calcPoorTeeShotsForClubs(): Record<OTTShotClub, number>;
    calcGreatTeeShotsForClubs(): Record<OTTShotClub, number>;
    calcShotsPerRoundForClubs(): Record<OTTShotClub, number>;
    calcFrequencyOTTForClubs(): Record<OTTShotClub, number>;
};

/**
 * Note: We don't have to check if a shot is OTT in this file since this is done
 * in the StrokesGainedCalculator which is where we are getting our shots in
 * @function getOTTShotsForClubs
 */

export class ClubOTTCalculator implements ClubOTTCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
    }

    private getOTTShotsForRounds(): {
        numberOfHolesForRound: number;
        offTheTeeShots: ShotStrokesGained[];
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
                    offTheTeeShots: [],
                };
            }

            const calculator = new StrokesGainedCalculator(round, shots, holes);
            const { offTheTeeShots } = calculator.calcStrokesGainedPerRound();

            const numberOfHoles = holes.length;
            const numberOfOTTShots = offTheTeeShots.length;

            return {
                numberOfHolesForRound: numberOfHoles,
                numberOfOTTShotsForRound: numberOfOTTShots,
                offTheTeeShots,
            };
        });

        return roundStats.filter(Boolean);
    }

    private getOTTShotsForClubs(): Record<OTTShotClub, ShotStrokesGained[]> {
        const roundStats = this.getOTTShotsForRounds();

        const shotsForEachClub: Record<OTTShotClub, ShotStrokesGained[]> = {
            [ShotClub.None]: [],
            [ShotClub.Driver]: [],
            [ShotClub.Wood3]: [],
            [ShotClub.Iron3]: [],
            [ShotClub.Iron4]: [],
            [ShotClub.Iron5]: [],
            [ShotClub.Iron6]: [],
            [ShotClub.Iron7]: [],
        };

        roundStats.forEach((round) => {
            round.offTheTeeShots.forEach((shot) => {
                let club = shot.club;

                if (club === ShotClub.Unknown) {
                    club = ShotClub.None;
                }

                const key = club as OTTShotClub;

                if (club in shotsForEachClub) {
                    shotsForEachClub[key].push(shot);
                }
            });
        });

        return shotsForEachClub;
    }

    calcAverageStrokesGainedForClubs(): {
        averageStrokesGainedPerRoundForClubs: Record<OTTShotClub, number>;
        averageStrokesGainedPerShotForClubs: Record<OTTShotClub, number>;
    } {
        const roundStats = this.getOTTShotsForRounds();
        let totalHolesForAllRounds = 0;

        for (const round of roundStats) {
            totalHolesForAllRounds += round.numberOfHolesForRound;
        }

        const shotsForEachClub = this.getOTTShotsForClubs();

        const averageStrokesGainedPerRoundForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        const averageStrokesGainedPerShotForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];
            let totalStrokesGained = 0;

            for (const shot of shots) {
                totalStrokesGained += shot.strokesGained;
            }

            const averageStrokesGainedPerRound = totalStrokesGained / (totalHolesForAllRounds / 18);
            averageStrokesGainedPerRoundForClubs[club] =
                +averageStrokesGainedPerRound.toFixed(3) || 0;

            const numberOfClubOTTShots = shots.length;
            const averageStrokesGainedPerShot =
                numberOfClubOTTShots === 0 ? 0 : totalStrokesGained / numberOfClubOTTShots;
            averageStrokesGainedPerShotForClubs[club] = +averageStrokesGainedPerShot.toFixed(3);
        }

        return {
            averageStrokesGainedPerRoundForClubs,
            averageStrokesGainedPerShotForClubs,
        };
    }

    calcFairwayAccuracyForClubs(): Record<OTTShotClub, number> {
        const shotsForEachClub = this.getOTTShotsForClubs();

        const fairwayAccuracyForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];
            const totalTeeShots = shots.length;
            let fairwayTeeShots = 0;

            for (const currentShot of shots) {
                const roundId = currentShot.roundId;

                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];

                const shotIndex = shotsForRound.findIndex((el) => el.id === currentShot.id);

                if (shotIndex === -1) {
                    continue;
                }

                const nextShot = shotsForRound[shotIndex + 1];

                if (!nextShot) {
                    continue;
                }

                if (nextShot.location === ShotLocation.Fairway) {
                    fairwayTeeShots++;
                }
            }

            const fairwayPercentage =
                totalTeeShots === 0 ? 0 : (fairwayTeeShots / totalTeeShots) * 100;
            fairwayAccuracyForClubs[club] = +fairwayPercentage.toFixed(2);
        }

        return fairwayAccuracyForClubs;
    }

    calcPoorTeeShotsForClubs(): Record<OTTShotClub, number> {
        const shotsForEachClub = this.getOTTShotsForClubs();

        const poorTeeShotsForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];
            const totalTeeShots = shots.length;
            let poorTeeShots = 0;

            for (const shot of shots) {
                if (shot.strokesGained <= -0.5) {
                    poorTeeShots++;
                }
            }

            const poorShotPercentage =
                totalTeeShots === 0 ? 0 : (poorTeeShots / totalTeeShots) * 100;
            poorTeeShotsForClubs[club] = +poorShotPercentage.toFixed(2);
        }

        return poorTeeShotsForClubs;
    }

    calcGreatTeeShotsForClubs(): Record<OTTShotClub, number> {
        const shotsForEachClub = this.getOTTShotsForClubs();

        const greatTeeShotsForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];
            const totalTeeShots = shots.length;
            let greatTeeShots = 0;

            for (const shot of shots) {
                if (shot.strokesGained >= 0.5) {
                    greatTeeShots++;
                }
            }

            const greatShotPercentage =
                totalTeeShots === 0 ? 0 : (greatTeeShots / totalTeeShots) * 100;
            greatTeeShotsForClubs[club] = +greatShotPercentage.toFixed(2);
        }

        return greatTeeShotsForClubs;
    }

    getTotalShotsForClubs(): Record<OTTShotClub, number> {
        const shotsForEachClub = this.getOTTShotsForClubs();

        const totalShotsForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];
            totalShotsForClubs[club] = shots.length;
        }

        return totalShotsForClubs;
    }

    calcShotsPerRoundForClubs(): Record<OTTShotClub, number> {
        const roundStats = this.getOTTShotsForRounds();
        let totalHolesForAllRounds = 0;

        for (const round of roundStats) {
            totalHolesForAllRounds += round.numberOfHolesForRound;
        }

        const shotsForEachClub = this.getOTTShotsForClubs();

        const shotsPerRoundForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];
            const totalTeeShots = shots.length;
            const shotsPerRound =
                totalHolesForAllRounds === 0 ? 0 : totalTeeShots / (totalHolesForAllRounds / 18);
            shotsPerRoundForClubs[club] = +shotsPerRound.toFixed(2);
        }

        return shotsPerRoundForClubs;
    }

    calcFrequencyOTTForClubs(): Record<OTTShotClub, number> {
        const shotsForEachClub = this.getOTTShotsForClubs();
        let totalShotsForAllClubs = 0;

        for (const shots of Object.values(shotsForEachClub)) {
            totalShotsForAllClubs += shots.length;
        }

        const frequencyOTTForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];
            const totalShotsForClub = shots.length;
            const frequency =
                totalShotsForAllClubs === 0 ? 0 : (totalShotsForClub / totalShotsForAllClubs) * 100;
            frequencyOTTForClubs[club] = Math.round(frequency);
        }

        return frequencyOTTForClubs;
    }

    calcTeeShotDistanceForClubs(): Record<OTTShotClub, number> {
        const shotsForEachClub = this.getOTTShotsForClubs();

        const averageAdjustedTeeShotDistanceForClubs: Record<OTTShotClub, number> = {
            [ShotClub.None]: 0,
            [ShotClub.Driver]: 0,
            [ShotClub.Wood3]: 0,
            [ShotClub.Iron3]: 0,
            [ShotClub.Iron4]: 0,
            [ShotClub.Iron5]: 0,
            [ShotClub.Iron6]: 0,
            [ShotClub.Iron7]: 0,
        };

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const shots = shotsForEachClub[club];

            let sumAdjustedTeeShotDistance = 0;
            let numValidTeeShots = 0;

            for (const currentShot of shots) {
                const roundId = currentShot.roundId;

                const shotsForRound = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];

                const shotIndex = shotsForRound.findIndex((el) => el.id === currentShot.id);

                if (shotIndex === -1) {
                    continue;
                }

                const nextShot = shotsForRound[shotIndex + 1];

                if (!nextShot) {
                    continue;
                }

                const adjCalc = new AdjustedShotCalculator(currentShot, nextShot);
                const adjustedTeeShotDistance = adjCalc.calculateAdjustedTeeShotDistance();

                if (!isNaN(adjustedTeeShotDistance)) {
                    sumAdjustedTeeShotDistance += adjustedTeeShotDistance;
                    numValidTeeShots++;
                }
            }

            const TOUR_AVERAGE_TEE_SHOT_DISTANCE = 289.48;

            const averageAdjustedTeeShotDistance =
                numValidTeeShots === 0
                    ? 0
                    : sumAdjustedTeeShotDistance / numValidTeeShots +
                      TOUR_AVERAGE_TEE_SHOT_DISTANCE;
            averageAdjustedTeeShotDistanceForClubs[club] =
                +averageAdjustedTeeShotDistance.toFixed(2);
        }

        return averageAdjustedTeeShotDistanceForClubs;
    }

    getAllOTTTableData(): OTTTableData[] {
        const shotsForEachClub = this.getOTTShotsForClubs();
        const totalShotsForClubs = this.getTotalShotsForClubs();
        const fairwayAccuracyForClubs = this.calcFairwayAccuracyForClubs();
        const poorTeeShotsForClubs = this.calcPoorTeeShotsForClubs();
        // const greatTeeShotsForClubs = this.calcGreatTeeShotsForClubs();
        const shotsPerRoundForClubs = this.calcShotsPerRoundForClubs();
        const frequencyOTTForClubs = this.calcFrequencyOTTForClubs();
        const averageStrokesGainedPerRoundForClubs =
            this.calcAverageStrokesGainedForClubs().averageStrokesGainedPerRoundForClubs;
        const averageStrokesGainedPerShotForClubs =
            this.calcAverageStrokesGainedForClubs().averageStrokesGainedPerShotForClubs;
        // const averageAdjustedTeeShotDistanceForClubs = this.calcTeeShotDistanceForClubs();

        const tableData: OTTTableData[] = [];

        for (const club of Object.keys(shotsForEachClub) as OTTShotClub[]) {
            const totalShots = totalShotsForClubs[club];
            const fairwayAccuracy = fairwayAccuracyForClubs[club];
            const poorTeeShots = poorTeeShotsForClubs[club];
            // const greatTeeShots = greatTeeShotsForClubs[club];
            const shotsPerRound = shotsPerRoundForClubs[club];
            const frequency = frequencyOTTForClubs[club];
            const sgPerRound = averageStrokesGainedPerRoundForClubs[club];
            const sgPerShot = averageStrokesGainedPerShotForClubs[club];
            // const avgDistance = averageAdjustedTeeShotDistanceForClubs[club];

            const tableRow: OTTTableData = {
                club,
                sgPerRound,
                sgPerShot,
                // avgDistance,
                fairwayAccuracy,
                poorTeeShots,
                // greatTeeShots,
                shotsPerRound,
                frequency,
                totalShots,
            };

            tableData.push(tableRow);
        }

        return tableData;
    }
}
