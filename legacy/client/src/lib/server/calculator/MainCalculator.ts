import type { Hole } from "../rounds/hole.service";
import type { Round } from "../rounds/round.service";
import type { Shot } from "../rounds/shot.service";
import { AverageAdjustedShotCalculator } from "./AverageAdjustedShotCalculator";
import {
    AveragesCalculator,
    type DistanceBucketReturnApproach,
    type DistanceBucketReturnShortGame,
} from "./AveragesCalculator";
import { BaseCalculator } from "./BaseCalculator";
import { ScoringCalculator } from "./ScoringCalculator";
import { ShotLocationCalculator } from "./TeeShotLocationCalculator";
import { AverageShotsPerRoundCalculator } from "./AverageShotsPerRoundCalculator";
import { StrokesGainedCalculator } from "./StrokesGainedCalculator";
import { ApproachShotLocationCalculator } from "./ApproachShotLocationCalculator";
import type {
    ApproachDistanceBucket,
    PuttingDistanceBucket,
    ShortGameDistanceBucket,
} from "$lib/types";
import { ShortGameShotLocationCalculator } from "./ShortGameShotLocationCalculator";
import { ClubOTTCalculator, type OTTTableData } from "./ClubOTTCalculator";
import { type ApproachTableData, ApproachTableCalculator } from "./ApproachTableCalculator";
import { ShortGameTableCalculator, type ShortGameTableData } from "./ShortGameTableCalculator";
import { PuttingTableCalculator, type PuttingTableData } from "./PuttingTableCalculator";

/**
 * TODO LIST FOR THIS FILE
 * 1. Abstract any common code between the calculators into a base class
 * 2. Create a new calculator for fairwayAccuracy, poorTeeShots, penalties so
 * don't have to do the calculations in the method below
 * 3. Create a new calculator for the chart data?
 * 4. Try remove any calculations out of this file and just call them here
 */

type Review = {
    totalPar: number;
    totalScore: number;
};

type RoundsCalculations = {
    id: string;
    score: number;
    date: string;
    holes: number;
    putt: number;
    arg: number;
    app: number;
    ott: number;
    total: number;
}[];

type AnalysisCalculations = {
    fairwayAccuracyPercentage: number;
    poorTeeShotsPercentage: number;
    penaltyPercentage: number;
    averageSGForAllRounds: number;
};

type AnalysisOverviewCalculations = {
    averageSGForAllRounds: number;
    averageSGOTTForAllRounds: number;
    averageSGApproachForAllRounds: number;
    averageSGShortGameForAllRounds: number;
    averageSGPuttingForAllRounds: number;
    overviewChartData: number[];
    overviewLabels: string[];
    averageFirst6HolesScore: number;
    averageMiddle6HolesScore: number;
    averageLast6HolesScore: number;
    fullRoundsAmount: number;
    averagePar3HolesScore: number;
    averagePar4HolesScore: number;
    averagePar5HolesScore: number;
};

type AnalysisOffTheTeeCalculations = {
    averageSGOTTForAllRounds: number;
    averageSGOTTForAllShots: number;
    averageSGOTTForAllRoundsPar4: number;
    averageSGOTTForAllRoundsPar5: number;
    offTheTeeChartData: number[];
    offTheTeeLabels: string[];
    totalOTTShots: number;
    fairwayAccuracyPercentage: number;
    poorTeeShotsPercentage: number;
    greatTeeShotsPercentage: number;
    avgSPRTeeShots: number;
    avgAdjustedTeeShotDistance: number;
    tableDataOTT: Promise<OTTTableData[]>;
};

type AnalysisApproachCalculations = {
    averageSGApproachForAllRounds: number;
    approachChartData: number[];
    approachLabels: string[];
    avgSPRApproachFairway: Record<string, number>;
    avgSPRApproachRough: Record<string, number>;
    averageSGApproachFairwayDistanceBuckets: DistanceBucketReturnApproach;
    averageSGApproachRoughDistanceBuckets: DistanceBucketReturnApproach;
    averageSGApproachDistanceBuckets: DistanceBucketReturnApproach;
    averageAdjustedApproachProximity: {
        fairway: Record<ApproachDistanceBucket, number>;
        fairwayValues: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
        roughValues: Record<ApproachDistanceBucket, number>;
    };
    averageAdjustedGreenHitPercentages: {
        fairway: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
    };
    poorAppShotPercentages: {
        fairway: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
    };
    tableDataApproach: ApproachTableData[];
};

type AnalysisShortGameCalculations = {
    averageSGShortGameForAllRounds: number;
    shortGameChartData: number[];
    shortGameLabels: string[];
    avgSPRShortGameFairway: Record<string, number>;
    avgSPRShortGameRough: Record<string, number>;
    avgSPRShortGameSand: Record<string, number>;
    averageSGFairwayShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGRoughShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGSandShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    poorShortGameShotPercentages: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    };
    greatShortGameShotPercentages: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    };
    avgShortGameProximities: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
        fairwayValues: Record<ShortGameDistanceBucket, number>;
        roughValues: Record<ShortGameDistanceBucket, number>;
        sandValues: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
    };
    avgShortGameGreenHitPercentages: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
        fairwayValues: Record<ShortGameDistanceBucket, number>;
        roughValues: Record<ShortGameDistanceBucket, number>;
        sandValues: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
    };
    adjustedHoleOutPercentages: Record<ShortGameDistanceBucket.ShortGame_0_25, number>;
    tableDataShortGame: ShortGameTableData[];
};

type AnalysisPuttingCalculations = {
    averageSGPuttingForAllRounds: number;
    averageSGPuttingLessThan10: number;
    averageSGPutting10_24: number;
    averageSGPutting25Plus: number;
    averageSGPuttingDistanceBuckets: {
        round: Record<PuttingDistanceBucket, number>;
        shot: Record<PuttingDistanceBucket, number>;
    };
    puttingChartData: number[];
    puttingLabels: string[];
    adjustedOnePuttPercentages: Record<string, number>;
    averageAdjustedProximity: Record<string, number>;
    averageShotsPerRoundPuttingDistanceBuckets: Record<string, number>;
    tableDataPutting: PuttingTableData[];
};

type SGPPuttingCalculations = {
    averageSGPuttingDistanceBuckets: {
        round: Record<PuttingDistanceBucket, number>;
        shot: Record<PuttingDistanceBucket, number>;
    };
    adjustedOnePuttPercentages: Record<string, number>;
    adjustedOnePuttAverages: Record<string, number>;
    averageAdjustedProximity: Record<string, number>;
    averageAdjustedProximityValue: Record<string, number>;
    averageShotsPerRoundPuttingDistanceBuckets: Record<string, number>;
};

type SGPOffTheTeeCalculations = {
    averageSGOTTForAllRounds: number;
    averageSGOTTForAllShots: number;
    avgSPRTeeShots: number;
    avgAdjustedTeeShotDistance: number;
    avgAdjustedTeeShotValue: number;
    fairwayAccuracyPercentage: number;
    poorTeeShotsPercentage: number;
};

type SGPApproachCalculations = {
    avgSPRApproachFairway: Record<string, number>;
    avgSPRApproachRough: Record<string, number>;
    averageSGApproachFairwayDistanceBuckets: DistanceBucketReturnApproach;
    averageSGApproachRoughDistanceBuckets: DistanceBucketReturnApproach;
    averageAdjustedApproachProximity: {
        fairway: Record<ApproachDistanceBucket, number>;
        fairwayValues: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
        roughValues: Record<ApproachDistanceBucket, number>;
    };
    averageAdjustedGreenHitPercentages: {
        fairway: Record<ApproachDistanceBucket, number>;
        fairwayValues: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
        roughValues: Record<ApproachDistanceBucket, number>;
    };
    poorAppShotPercentages: {
        fairway: Record<ApproachDistanceBucket, number>;
        rough: Record<ApproachDistanceBucket, number>;
    };
};

type SGPShortGameCalculations = {
    averageSGShortGameForAllRounds: number;
    shortGameChartData: number[];
    shortGameLabels: string[];
    avgSPRShortGameFairway: Record<string, number>;
    avgSPRShortGameRough: Record<string, number>;
    avgSPRShortGameSand: Record<string, number>;
    averageSGFairwayShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGRoughShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGSandShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    averageSGShortGameDistanceBuckets: DistanceBucketReturnShortGame;
    poorShortGameShotPercentages: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    };
    greatShortGameShotPercentages: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<ShortGameDistanceBucket, number>;
    };
    avgShortGameProximities: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
        fairwayValues: Record<ShortGameDistanceBucket, number>;
        roughValues: Record<ShortGameDistanceBucket, number>;
        sandValues: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
    };
    avgShortGameGreenHitPercentages: {
        fairway: Record<ShortGameDistanceBucket, number>;
        rough: Record<ShortGameDistanceBucket, number>;
        sand: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
        fairwayValues: Record<ShortGameDistanceBucket, number>;
        roughValues: Record<ShortGameDistanceBucket, number>;
        sandValues: Record<
            ShortGameDistanceBucket.ShortGame_0_25 | ShortGameDistanceBucket.ShortGame_26_50,
            number
        >;
    };
    adjustedHoleOutPercentages: Record<ShortGameDistanceBucket.ShortGame_0_25, number>;
    adjustedHoleOutAverages: Record<ShortGameDistanceBucket.ShortGame_0_25, number>;
    tableDataShortGame: ShortGameTableData[];
};

type MainCalculator = {
    calcReview(): Review;
    calcRounds(): RoundsCalculations;
    calcAnalysis(): AnalysisCalculations;
    calcAnalysisOverview(): AnalysisOverviewCalculations;
    calcAnalysisOffTheTee(): AnalysisOffTheTeeCalculations;
    calcAnalysisApproach(): AnalysisApproachCalculations;
    calcAnalysisShortGame(): AnalysisShortGameCalculations;
    calcAnalysisPutting(): AnalysisPuttingCalculations;
    calcSGPPutting(): SGPPuttingCalculations;
    calcSGPOffTheTee(): SGPOffTheTeeCalculations;
    calcSGPApproach(): SGPApproachCalculations;
};

export class Calculator implements MainCalculator {
    rounds: Round[];
    shots: Shot[][];
    holes: Hole[][];

    constructor(rounds: Round[], shots: Shot[][], holes: Hole[][]) {
        this.rounds = rounds;
        this.shots = shots;
        this.holes = holes;
    }

    /**
     * @see /rounds/:roundId/step4
     * We only need the first hole and shot since we are calculating
     * the total par and total score for one round.
     */
    calcReview(): Review {
        const shots = this.shots[0] ?? [];
        const holes = this.holes[0] ?? [];
        const baseCalc = new BaseCalculator(shots, holes);
        const totalPar = baseCalc.calcTotalPar();
        const totalScore = baseCalc.calcTotalScore();
        return {
            totalPar,
            totalScore,
        };
    }

    /**
     * @see /rounds/+page.server.ts
     */
    calcRounds(): RoundsCalculations {
        const roundsWithCalculations = this.rounds.map((round) => {
            const roundId = round.id;
            const shots = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === roundId) ?? [];

            const strokesGainedCalc = new StrokesGainedCalculator(round, shots, holes);
            const strokesGained = strokesGainedCalc.calcStrokesGainedPerRound();

            const baseCalc = new BaseCalculator(shots, holes);
            const totalScore = baseCalc.calcTotalScore();

            const numberOfHoles = holes.length;

            return {
                id: roundId,
                score: totalScore,
                date: round.date,
                holes: numberOfHoles,
                putt: strokesGained.totalStrokesGainedPutting,
                arg: strokesGained.totalStrokesGainedShortGame,
                app: strokesGained.totalStrokesGainedApproach,
                ott: strokesGained.totalStrokesGainedOffTheTee,
                total: strokesGained.totalStrokesGained,
            };
        });

        return roundsWithCalculations;
    }

    /**
     * @see /analysis/+layout.server.ts
     */
    calcAnalysis(): AnalysisCalculations {
        const roundShotCalculations = this.rounds.map((round) => {
            const roundId = round.id;
            const shots = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === roundId) ?? [];

            const shotLocationCalc = new ShotLocationCalculator(round, shots, holes);

            const fairwayAccuracy = shotLocationCalc.calcFairwayAccuracyPerRound();
            const poorTeeShots = shotLocationCalc.calcPoorTeeShotsPerRound();
            const penalties = shotLocationCalc.calcPenaltyPercentagePerRound();

            return {
                fairwayAccuracy,
                poorTeeShots,
                penalties,
            };
        });

        let fairwayAccuracyPercentage = 0;
        let fairwayTeeShots = 0;
        let totalTeeShots = 0;
        for (const round of roundShotCalculations) {
            fairwayTeeShots += round.fairwayAccuracy.fairwayTeeShots;
            totalTeeShots += round.fairwayAccuracy.totalTeeShots;
        }
        fairwayAccuracyPercentage = +((fairwayTeeShots / totalTeeShots) * 100).toFixed(2);

        let penaltyPercentage = 0;
        let totalPenalties = 0;
        let totalTeeShotsForPenalties = 0;
        for (const round of roundShotCalculations) {
            totalPenalties += round.penalties.penalties;
            totalTeeShotsForPenalties += round.penalties.totalTeeShots;
        }
        penaltyPercentage = +((totalPenalties / totalTeeShotsForPenalties) * 100).toFixed(2);

        let poorTeeShotsPercentage = 0;
        let poorTeeShots = 0;
        totalTeeShots = 0;
        for (const round of roundShotCalculations) {
            poorTeeShots += round.poorTeeShots.poorTeeShots;
            totalTeeShots += round.poorTeeShots.totalTeeShots;
        }
        poorTeeShotsPercentage = +((poorTeeShots / totalTeeShots) * 100).toFixed(2);

        // Average
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const { averageSGForAllRounds } = avgCalculator.calcAverageStrokesGained();

        return {
            fairwayAccuracyPercentage,
            poorTeeShotsPercentage,
            penaltyPercentage,
            averageSGForAllRounds,
        };
    }

    /**
     * @see /analysis/+page.server.ts
     */
    calcAnalysisOverview(): AnalysisOverviewCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const {
            averageSGForAllRounds,
            averageSGOTTForAllRounds,
            averageSGApproachForAllRounds,
            averageSGShortGameForAllRounds,
            averageSGPuttingForAllRounds,
        } = avgCalculator.calcAverageStrokesGained();

        const overviewChartData: number[] = [];
        const overviewLabels: string[] = [];
        for (const round of this.rounds) {
            const shots = this.shots.find((el) => el[0]?.roundId === round.id) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === round.id) ?? [];

            const strokesGainedCalc = new StrokesGainedCalculator(round, shots, holes);
            const strokesGainedFullRound =
                strokesGainedCalc.calcStrokesGainedPerRound().totalStrokesGained;

            overviewChartData.push(strokesGainedFullRound);
            overviewLabels.push(new Date(round.date).toLocaleDateString());
        }

        // Scoring Calculations

        const scoreCalculator = new ScoringCalculator(this.rounds, this.shots, this.holes);

        const averageFirst6HolesScore = scoreCalculator.calcFirst6Holes();
        const averageMiddle6HolesScore = scoreCalculator.calcMiddle6Holes();
        const averageLast6HolesScore = scoreCalculator.calcLast6Holes();
        const fullRoundsAmount = scoreCalculator.getFullRounds().length;
        const averagePar3HolesScore = scoreCalculator.calcPar3Holes();
        const averagePar4HolesScore = scoreCalculator.calcPar4Holes();
        const averagePar5HolesScore = scoreCalculator.calcPar5Holes();

        return {
            averageSGForAllRounds,
            averageSGOTTForAllRounds,
            averageSGApproachForAllRounds,
            averageSGShortGameForAllRounds,
            averageSGPuttingForAllRounds,
            overviewChartData,
            overviewLabels,
            averageFirst6HolesScore,
            averageMiddle6HolesScore,
            averageLast6HolesScore,
            fullRoundsAmount,
            averagePar3HolesScore,
            averagePar4HolesScore,
            averagePar5HolesScore,
        };
    }

    /**
     * @see /analysis/off-the-tee/+page.server.ts
     */
    calcAnalysisOffTheTee(): AnalysisOffTheTeeCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const {
            averageSGOTTForAllRounds,
            averageSGOTTForAllShots,
            averageSGOTTForAllRoundsPar4,
            averageSGOTTForAllRoundsPar5,
        } = avgCalculator.calcAverageStrokesGained();

        const offTheTeeChartData: number[] = [];
        const offTheTeeLabels: string[] = [];
        for (const round of this.rounds) {
            const shots = this.shots.find((el) => el[0]?.roundId === round.id) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === round.id) ?? [];

            const sgCalculator = new StrokesGainedCalculator(round, shots, holes);

            const sgOTT = sgCalculator.calcStrokesGainedPerRound().totalStrokesGainedOffTheTee;

            offTheTeeChartData.push(sgOTT);
            offTheTeeLabels.push(new Date(round.date).toLocaleDateString());
        }

        const roundShotCalculations = this.rounds.map((round) => {
            const roundId = round.id;
            const shots = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === roundId) ?? [];

            const shotLocationCalc = new ShotLocationCalculator(round, shots, holes);

            const fairwayAccuracy = shotLocationCalc.calcFairwayAccuracyPerRound();
            const poorTeeShots = shotLocationCalc.calcPoorTeeShotsPerRound();
            const greatTeeShots = shotLocationCalc.calcGreatTeeShotsPerRound();

            const baseCalc = new BaseCalculator(shots, holes);
            const shotsOTT = baseCalc.calcOTTShots();

            return {
                fairwayAccuracy,
                poorTeeShots,
                greatTeeShots,
                shotsOTT,
            };
        });

        let totalOTTShots = 0;
        for (const round of roundShotCalculations) {
            totalOTTShots += round.shotsOTT;
        }

        let fairwayAccuracyPercentage = 0;
        let fairwayTeeShots = 0;
        let totalTeeShots = 0;
        for (const round of roundShotCalculations) {
            fairwayTeeShots += round.fairwayAccuracy.fairwayTeeShots;
            totalTeeShots += round.fairwayAccuracy.totalTeeShots;
        }
        fairwayAccuracyPercentage = +((fairwayTeeShots / totalTeeShots) * 100).toFixed(2);

        let poorTeeShotsPercentage = 0;
        let poorTeeShots = 0;
        totalTeeShots = 0;
        for (const round of roundShotCalculations) {
            poorTeeShots += round.poorTeeShots.poorTeeShots;
            totalTeeShots += round.poorTeeShots.totalTeeShots;
        }
        poorTeeShotsPercentage = +((poorTeeShots / totalTeeShots) * 100).toFixed(2);

        let greatTeeShotsPercentage = 0;
        let greatTeeShots = 0;
        totalTeeShots = 0;
        for (const round of roundShotCalculations) {
            greatTeeShots += round.greatTeeShots.greatTeeShots;
            totalTeeShots += round.greatTeeShots.totalTeeShots;
        }

        greatTeeShotsPercentage = +((greatTeeShots / totalTeeShots) * 100).toFixed(2);

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const averageShotsPerRound = averageShotsPerRoundCalculator.calcAverageShotsPerRound();
        const avgSPRTeeShots = averageShotsPerRound.teeShots;

        const adjShotCalc = new AverageAdjustedShotCalculator(this.rounds, this.shots, this.holes);

        const { avgAdjustedTeeShotDistance } =
            adjShotCalc.calculateAverageAdjustedTeeShotDistance();

        const clubOTT = new ClubOTTCalculator(this.rounds, this.shots, this.holes);

        const tableDataOTT = new Promise<OTTTableData[]>((resolve) => resolve(clubOTT.getAllOTTTableData()));

        return {
            averageSGOTTForAllRounds,
            averageSGOTTForAllShots,
            averageSGOTTForAllRoundsPar4,
            averageSGOTTForAllRoundsPar5,
            offTheTeeChartData,
            offTheTeeLabels,
            totalOTTShots,
            fairwayAccuracyPercentage,
            poorTeeShotsPercentage,
            greatTeeShotsPercentage,
            avgSPRTeeShots,
            avgAdjustedTeeShotDistance,
            tableDataOTT,
        };
    }

    /**
     * @see /analysis/approach/+page.server.ts
     */
    calcAnalysisApproach(): AnalysisApproachCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const {
            averageSGApproachForAllRounds,
            averageSGApproachFairwayDistanceBuckets,
            averageSGApproachRoughDistanceBuckets,
            averageSGApproachDistanceBuckets,
        } = avgCalculator.calcAverageStrokesGained();

        const approachChartData: number[] = [];
        const approachLabels: string[] = [];
        for (const round of this.rounds) {
            const shots = this.shots.find((el) => el[0]?.roundId === round.id) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === round.id) ?? [];

            const sgCalculator = new StrokesGainedCalculator(round, shots, holes);

            const sgApproach = sgCalculator.calcStrokesGainedPerRound().totalStrokesGainedApproach;

            approachChartData.push(sgApproach);
            approachLabels.push(new Date(round.date).toLocaleDateString());
        }

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const avgSPR = averageShotsPerRoundCalculator.calcAverageShotsPerRound();

        const avgSPRApproachFairway = avgSPR.fairwayApproachShotDistanceBuckets;

        const avgSPRApproachRough = avgSPR.roughApproachShotDistanceBuckets;

        const adjShotCalc = new AverageAdjustedShotCalculator(this.rounds, this.shots, this.holes);

        const averageAdjustedApproachProximity = adjShotCalc.calcAverageAdjustedApproachProximity();

        const averageAdjustedGreenHitPercentages =
            adjShotCalc.calculateAverageAdjustedApproachGreenHitPercentages();

        const appShotLocationCalc = new ApproachShotLocationCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const poorAppShotPercentages =
            appShotLocationCalc.calcAveragePoorApproachShotPercentageByDistanceBucket();

        const appTableCalc = new ApproachTableCalculator(this.rounds, this.shots, this.holes);

        const tableDataApproach = appTableCalc.getAllApproachTableData();

        return {
            averageSGApproachForAllRounds,
            approachChartData,
            approachLabels,
            avgSPRApproachFairway,
            avgSPRApproachRough,
            averageSGApproachFairwayDistanceBuckets,
            averageSGApproachRoughDistanceBuckets,
            averageSGApproachDistanceBuckets,
            averageAdjustedApproachProximity,
            averageAdjustedGreenHitPercentages,
            poorAppShotPercentages,
            tableDataApproach,
        };
    }

    /**
     * @see /analysis/short-game/+page.server.ts
     */
    calcAnalysisShortGame(): AnalysisShortGameCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const {
            averageSGShortGameForAllRounds,
            averageSGFairwayShortGameDistanceBuckets,
            averageSGRoughShortGameDistanceBuckets,
            averageSGSandShortGameDistanceBuckets,
            averageSGShortGameDistanceBuckets,
        } = avgCalculator.calcAverageStrokesGained();

        const shortGameChartData: number[] = [];
        const shortGameLabels: string[] = [];
        for (const round of this.rounds) {
            const shots = this.shots.find((el) => el[0]?.roundId === round.id) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === round.id) ?? [];

            const sgCalculator = new StrokesGainedCalculator(round, shots, holes);

            const sgShortGame =
                sgCalculator.calcStrokesGainedPerRound().totalStrokesGainedShortGame;

            shortGameChartData.push(sgShortGame);
            shortGameLabels.push(new Date(round.date).toLocaleDateString());
        }

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const avgSPR = averageShotsPerRoundCalculator.calcAverageShotsPerRound();

        const avgSPRShortGameFairway = avgSPR.fairwayShortGameDistanceBuckets;
        const avgSPRShortGameRough = avgSPR.roughShortGameDistanceBuckets;
        const avgSPRShortGameSand = avgSPR.sandShortGameDistanceBuckets;

        const shortGameShotLocationCalcs = new ShortGameShotLocationCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const poorShortGameShotPercentages =
            shortGameShotLocationCalcs.calcAveragePoorShortGameShotPercentageByDistanceBucket();
        const greatShortGameShotPercentages =
            shortGameShotLocationCalcs.calcAverageGreatShortGameShotPercentageByDistanceBucket();

        const adjShotCalc = new AverageAdjustedShotCalculator(this.rounds, this.shots, this.holes);

        const avgShortGameProximities = adjShotCalc.calculateAverageAdjustedShortGameProximity();

        const avgShortGameGreenHitPercentages =
            adjShotCalc.calculateAverageAdjustedShortGameGreenHitPercentages();

        const adjustedHoleOutPercentages = adjShotCalc.calculateAdjustedHoleOutPercentages();

        const shortGameTableCalc = new ShortGameTableCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const tableDataShortGame = shortGameTableCalc.getAllShortGameTableData();

        return {
            averageSGShortGameForAllRounds,
            shortGameChartData,
            shortGameLabels,
            avgSPRShortGameFairway,
            avgSPRShortGameRough,
            avgSPRShortGameSand,
            averageSGFairwayShortGameDistanceBuckets,
            averageSGRoughShortGameDistanceBuckets,
            averageSGSandShortGameDistanceBuckets,
            averageSGShortGameDistanceBuckets,
            poorShortGameShotPercentages,
            greatShortGameShotPercentages,
            avgShortGameProximities,
            avgShortGameGreenHitPercentages,
            adjustedHoleOutPercentages,
            tableDataShortGame,
        };
    }

    /**
     * @see /analysis/putting/+page.server.ts
     */
    calcAnalysisPutting(): AnalysisPuttingCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const {
            averageSGPuttingForAllRounds,
            averageSGPuttingLessThan10,
            averageSGPutting10_24,
            averageSGPutting25Plus,
            averageSGPuttingDistanceBuckets,
        } = avgCalculator.calcAverageStrokesGained();

        const puttingChartData: number[] = [];
        const puttingLabels: string[] = [];
        for (const round of this.rounds) {
            const shots = this.shots.find((el) => el[0]?.roundId === round.id) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === round.id) ?? [];

            const sgCalculator = new StrokesGainedCalculator(round, shots, holes);

            const sgPutting = sgCalculator.calcStrokesGainedPerRound().totalStrokesGainedPutting;

            puttingChartData.push(sgPutting);
            puttingLabels.push(new Date(round.date).toLocaleDateString());
        }

        const adjShotPrcCalc = new AverageAdjustedShotCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const adjustedOnePuttPercentages = adjShotPrcCalc.calculateAdjustedOnePuttPercentages();

        const { averageAdjustedProximity } = adjShotPrcCalc.calcAverageAdjustedProximityPutting();

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const averageShotsPerRound = averageShotsPerRoundCalculator.calcAverageShotsPerRound();

        const averageShotsPerRoundPuttingDistanceBuckets =
            averageShotsPerRound.greenShotDistanceBuckets;

        const puttingTableCalc = new PuttingTableCalculator(this.rounds, this.shots, this.holes);

        const tableDataPutting = puttingTableCalc.getAllPuttingTableData();

        return {
            averageSGPuttingForAllRounds,
            averageSGPuttingLessThan10,
            averageSGPutting10_24,
            averageSGPutting25Plus,
            averageSGPuttingDistanceBuckets,
            puttingChartData,
            puttingLabels,
            adjustedOnePuttPercentages,
            averageAdjustedProximity,
            averageShotsPerRoundPuttingDistanceBuckets,
            tableDataPutting,
        };
    }

    calcSGPPutting(): SGPPuttingCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const { averageSGPuttingDistanceBuckets } = avgCalculator.calcAverageStrokesGained();

        const adjShotPrcCalc = new AverageAdjustedShotCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const adjustedOnePuttPercentages = adjShotPrcCalc.calculateAdjustedOnePuttPercentages();

        const adjustedOnePuttAverages = adjShotPrcCalc.calculateAdjustedOnePuttAverages();

        const { averageAdjustedProximity, averageAdjustedProximityValue } =
            adjShotPrcCalc.calcAverageAdjustedProximityPutting();

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const averageShotsPerRound = averageShotsPerRoundCalculator.calcAverageShotsPerRound();

        const averageShotsPerRoundPuttingDistanceBuckets =
            averageShotsPerRound.greenShotDistanceBuckets;

        return {
            averageSGPuttingDistanceBuckets,
            adjustedOnePuttPercentages,
            adjustedOnePuttAverages,
            averageAdjustedProximity,
            averageAdjustedProximityValue,
            averageShotsPerRoundPuttingDistanceBuckets,
        };
    }

    calcSGPOffTheTee(): SGPOffTheTeeCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const { averageSGOTTForAllRounds, averageSGOTTForAllShots } =
            avgCalculator.calcAverageStrokesGained();

        const roundShotCalculations = this.rounds.map((round) => {
            const roundId = round.id;
            const shots = this.shots.find((el) => el[0]?.roundId === roundId) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === roundId) ?? [];

            const shotLocationCalc = new ShotLocationCalculator(round, shots, holes);

            const fairwayAccuracy = shotLocationCalc.calcFairwayAccuracyPerRound();
            const poorTeeShots = shotLocationCalc.calcPoorTeeShotsPerRound();

            return {
                fairwayAccuracy,
                poorTeeShots,
            };
        });

        let fairwayAccuracyPercentage = 0;
        let fairwayTeeShots = 0;
        let totalTeeShots = 0;
        for (const round of roundShotCalculations) {
            fairwayTeeShots += round.fairwayAccuracy.fairwayTeeShots;
            totalTeeShots += round.fairwayAccuracy.totalTeeShots;
        }
        fairwayAccuracyPercentage = +((fairwayTeeShots / totalTeeShots) * 100).toFixed(2);

        let poorTeeShotsPercentage = 0;
        let poorTeeShots = 0;
        totalTeeShots = 0;
        for (const round of roundShotCalculations) {
            poorTeeShots += round.poorTeeShots.poorTeeShots;
            totalTeeShots += round.poorTeeShots.totalTeeShots;
        }
        poorTeeShotsPercentage = +((poorTeeShots / totalTeeShots) * 100).toFixed(2);

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const averageShotsPerRound = averageShotsPerRoundCalculator.calcAverageShotsPerRound();
        const avgSPRTeeShots = averageShotsPerRound.teeShots;

        const adjShotCalc = new AverageAdjustedShotCalculator(this.rounds, this.shots, this.holes);

        const { avgAdjustedTeeShotDistance, avgAdjustedTeeShotValue } =
            adjShotCalc.calculateAverageAdjustedTeeShotDistance();

        return {
            averageSGOTTForAllRounds,
            averageSGOTTForAllShots,
            avgSPRTeeShots,
            avgAdjustedTeeShotDistance,
            avgAdjustedTeeShotValue,
            fairwayAccuracyPercentage,
            poorTeeShotsPercentage,
        };
    }

    calcSGPApproach(): SGPApproachCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const { averageSGApproachFairwayDistanceBuckets, averageSGApproachRoughDistanceBuckets } =
            avgCalculator.calcAverageStrokesGained();

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const avgSPR = averageShotsPerRoundCalculator.calcAverageShotsPerRound();

        const avgSPRApproachFairway = avgSPR.fairwayApproachShotDistanceBuckets;

        const avgSPRApproachRough = avgSPR.roughApproachShotDistanceBuckets;

        const adjShotCalc = new AverageAdjustedShotCalculator(this.rounds, this.shots, this.holes);

        const averageAdjustedApproachProximity = adjShotCalc.calcAverageAdjustedApproachProximity();

        const averageAdjustedGreenHitPercentages =
            adjShotCalc.calculateAverageAdjustedApproachGreenHitPercentages();

        const appShotLocationCalc = new ApproachShotLocationCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const poorAppShotPercentages =
            appShotLocationCalc.calcAveragePoorApproachShotPercentageByDistanceBucket();

        return {
            avgSPRApproachFairway,
            avgSPRApproachRough,
            averageSGApproachFairwayDistanceBuckets,
            averageSGApproachRoughDistanceBuckets,
            averageAdjustedApproachProximity,
            averageAdjustedGreenHitPercentages,
            poorAppShotPercentages,
        };
    }

    calcSGPShortGame(): SGPShortGameCalculations {
        const avgCalculator = new AveragesCalculator(this.rounds, this.shots, this.holes);

        const {
            averageSGShortGameForAllRounds,
            averageSGFairwayShortGameDistanceBuckets,
            averageSGRoughShortGameDistanceBuckets,
            averageSGSandShortGameDistanceBuckets,
            averageSGShortGameDistanceBuckets,
        } = avgCalculator.calcAverageStrokesGained();

        const shortGameChartData: number[] = [];
        const shortGameLabels: string[] = [];
        for (const round of this.rounds) {
            const shots = this.shots.find((el) => el[0]?.roundId === round.id) ?? [];
            const holes = this.holes.find((el) => el[0]?.roundId === round.id) ?? [];

            const sgCalculator = new StrokesGainedCalculator(round, shots, holes);

            const sgShortGame =
                sgCalculator.calcStrokesGainedPerRound().totalStrokesGainedShortGame;

            shortGameChartData.push(sgShortGame);
            shortGameLabels.push(round.date);
        }

        const averageShotsPerRoundCalculator = new AverageShotsPerRoundCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const avgSPR = averageShotsPerRoundCalculator.calcAverageShotsPerRound();

        const avgSPRShortGameFairway = avgSPR.fairwayShortGameDistanceBuckets;
        const avgSPRShortGameRough = avgSPR.roughShortGameDistanceBuckets;
        const avgSPRShortGameSand = avgSPR.sandShortGameDistanceBuckets;

        const shortGameShotLocationCalcs = new ShortGameShotLocationCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const poorShortGameShotPercentages =
            shortGameShotLocationCalcs.calcAveragePoorShortGameShotPercentageByDistanceBucket();
        const greatShortGameShotPercentages =
            shortGameShotLocationCalcs.calcAverageGreatShortGameShotPercentageByDistanceBucket();

        const adjShotCalc = new AverageAdjustedShotCalculator(this.rounds, this.shots, this.holes);

        const avgShortGameProximities = adjShotCalc.calculateAverageAdjustedShortGameProximity();

        const avgShortGameGreenHitPercentages =
            adjShotCalc.calculateAverageAdjustedShortGameGreenHitPercentages();

        const adjustedHoleOutPercentages = adjShotCalc.calculateAdjustedHoleOutPercentages();

        const adjustedHoleOutAverages = adjShotCalc.calculateAdjustedHoleOutAverages();

        const shortGameTableCalc = new ShortGameTableCalculator(
            this.rounds,
            this.shots,
            this.holes,
        );

        const tableDataShortGame = shortGameTableCalc.getAllShortGameTableData();

        return {
            averageSGShortGameForAllRounds,
            shortGameChartData,
            shortGameLabels,
            avgSPRShortGameFairway,
            avgSPRShortGameRough,
            avgSPRShortGameSand,
            averageSGFairwayShortGameDistanceBuckets,
            averageSGRoughShortGameDistanceBuckets,
            averageSGSandShortGameDistanceBuckets,
            averageSGShortGameDistanceBuckets,
            poorShortGameShotPercentages,
            greatShortGameShotPercentages,
            avgShortGameProximities,
            avgShortGameGreenHitPercentages,
            adjustedHoleOutPercentages,
            adjustedHoleOutAverages,
            tableDataShortGame,
        };
    }
}
