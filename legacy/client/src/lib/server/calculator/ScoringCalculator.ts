import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";

type ScoringCalculatorReturn = {
    calcFirst6Holes: () => number;
    calcMiddle6Holes: () => number;
    calcLast6Holes: () => number;
    calcPar3Holes: () => number;
    calcPar4Holes: () => number;
    calcPar5Holes: () => number;
    getFullRounds: () => Round[];
};

export class ScoringCalculator implements ScoringCalculatorReturn {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];
    fullRounds: Round[];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
        this.fullRounds = this.getFullRounds();
    }

    calcFirst6Holes(): number {
        const first6HolesStats = this.fullRounds.map((_, i) => {
            const first6Holes = this.getHolesForRange(i, 0, 6);
            const first6HolesPar = this.calculateTotalPar(first6Holes);
            const first6HolesScore = this.calculateTotalScore(i, first6Holes);

            return {
                first6HolesPar,
                first6HolesScore,
            };
        });

        let totalPar = 0;
        let totalScore = 0;
        for (const stat of first6HolesStats) {
            totalPar += stat.first6HolesPar;
            totalScore += stat.first6HolesScore;
        }
        
        const averageFirst6HolesScore = (totalScore - totalPar) / this.fullRounds.length;

        return averageFirst6HolesScore;
    }

    calcMiddle6Holes(): number {
        const middle6HolesStats = this.fullRounds.map((_, i) => {
            const middle6Holes = this.getHolesForRange(i, 6, 12);
            const middle6HolesPar = this.calculateTotalPar(middle6Holes);
            const middle6HolesScore = this.calculateTotalScore(i, middle6Holes);

            return {
                middle6HolesPar,
                middle6HolesScore,
            };
        });

        let totalPar = 0;
        let totalScore = 0;
        for (const stat of middle6HolesStats) {
            totalPar += stat.middle6HolesPar;
            totalScore += stat.middle6HolesScore;
        }

        const averageMiddle6HolesScore = (totalScore - totalPar) / this.fullRounds.length;

        return averageMiddle6HolesScore;
    }

    calcLast6Holes(): number {
        const last6HolesStats = this.fullRounds.map((_, i) => {
            const last6Holes = this.getHolesForRange(i, 12, 18);
            const last6HolesPar = this.calculateTotalPar(last6Holes);
            const last6HolesScore = this.calculateTotalScore(i, last6Holes);

            return {
                last6HolesPar,
                last6HolesScore,
            };
        });

        let totalPar = 0;
        let totalScore = 0;
        for (const stat of last6HolesStats) {
            totalPar += stat.last6HolesPar;
            totalScore += stat.last6HolesScore;
        }

        const averageLast6HolesScore = (totalScore - totalPar) / this.fullRounds.length;

        return averageLast6HolesScore;
    }

    calcPar3Holes(): number {
        const par3HolesStats = this.rounds.map((_, i) => {
            const par3Holes = this.getSpecificParHoles(i, 3);
            const par3HolesPar = this.calculateTotalPar(par3Holes);
            const par3HolesScore = this.calculateTotalScore(i, par3Holes);

            return {
                par3Holes,
                par3HolesPar,
                par3HolesScore,
            };
        });


        let totalHoles = 0;
        let totalScore = 0;
        for (const stat of par3HolesStats) {
            totalHoles += stat.par3Holes.length;
            totalScore += stat.par3HolesScore;
        }

        const averagePar3HolesScore = totalScore !== 0 ? +(totalScore / totalHoles).toFixed(2) : 0;

        return averagePar3HolesScore;
    }

    calcPar4Holes(): number {
        const par4HolesStats = this.rounds.map((_, i) => {
            const par4Holes = this.getSpecificParHoles(i, 4);
            const par4HolesPar = this.calculateTotalPar(par4Holes);
            const par4HolesScore = this.calculateTotalScore(i, par4Holes);

            return {
                par4Holes,
                par4HolesPar,
                par4HolesScore,
            };
        });

        let totalHoles = 0;
        let totalScore = 0;
        for (const stat of par4HolesStats) {
            totalHoles += stat.par4Holes.length;
            totalScore += stat.par4HolesScore;
        }

        const averagePar4HolesScore = totalScore !== 0 ? +(totalScore / totalHoles).toFixed(2) : 0;
        return averagePar4HolesScore;
    }

    calcPar5Holes(): number {
        const par5HolesStats = this.rounds.map((_, i) => {
            const par5Holes = this.getSpecificParHoles(i, 5);
            const par5HolesPar = this.calculateTotalPar(par5Holes);
            const par5HolesScore = this.calculateTotalScore(i, par5Holes);

            return {
                par5Holes,
                par5HolesPar,
                par5HolesScore,
            };
        });

        let totalHoles = 0;
        let totalScore = 0;
        for (const stat of par5HolesStats) {
            totalHoles += stat.par5Holes.length;
            totalScore += stat.par5HolesScore;
        }

        const averagePar5HolesScore = totalScore !== 0 ? +(totalScore / totalHoles).toFixed(2) : 0;
        return averagePar5HolesScore;
    }

    getFullRounds(): Round[] {
        const fullRounds: Round[] = [];
        for (const round of this.rounds) {
            let isFullRound = true;
            for (const holesForRound of this.holes) {
                if (!holesForRound[0]) {
                    isFullRound = false;
                    break;
                }
                if (holesForRound[0]?.roundId === round.id && holesForRound.length !== 18) {
                    isFullRound = false;
                    break;
                }
            }
            if (isFullRound) {
                fullRounds.push(round);
            }
        }
        return fullRounds;
    }

    private getHolesForRange(roundIndex: number, start: number, end: number): Hole[] {
        const roundHoles = this.holes[roundIndex] ?? [];
        return roundHoles.slice(start, end);
    }

    private calculateTotalPar(holes: Hole[]): number {
        let totalPar = 0;
        for (const hole of holes) {
            totalPar += hole.par;
        }
        return totalPar;
    }

    private calculateTotalScore(roundIndex: number, holes: Hole[]): number {
        let totalScore = 0;
        for (const hole of holes) {
            const shotsForHole =
                this.shots[roundIndex]?.filter((shot) => shot.hole === hole.hole) ?? [];
            if (shotsForHole.length === 0) {
                throw new Error(`Shots not found for hole ${hole.hole}`);
            }
            totalScore += shotsForHole.length;
        }
        return totalScore;
    }

    private getSpecificParHoles(roundIndex: number, parNumber: number): Hole[] {
        const roundHoles = this.holes[roundIndex] ?? [];
        return roundHoles.filter((hole) => hole.par === parNumber);
    }
}
