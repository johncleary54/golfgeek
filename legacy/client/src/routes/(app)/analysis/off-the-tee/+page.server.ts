import type { PageServerLoad } from "./$types";
import { Calculator } from "$lib/server/calculator/MainCalculator";
import type { OTTTableData } from "$lib/server/calculator/ClubOTTCalculator";

export const load = (async ({ parent }) => {
    const { filteredRounds, shotsForRounds, holesForRounds } = await parent();

    const calculator = new Calculator(filteredRounds, shotsForRounds, holesForRounds);

    const {
        averageSGOTTForAllRounds,
        averageSGOTTForAllShots,
        averageSGOTTForAllRoundsPar4,
        averageSGOTTForAllRoundsPar5,
        offTheTeeChartData,
        offTheTeeLabels,
        totalOTTShots,
        fairwayAccuracyPercentage,
        poorTeeShotsPercentage,
        // greatTeeShotsPercentage,
        avgSPRTeeShots,
        avgAdjustedTeeShotDistance,
        tableDataOTT,
    } = calculator.calcAnalysisOffTheTee();

    const tableColumns = [
        "CLUB",
        "SG/ROUND",
        "SG/SHOT",
        // "AVG DISTANCE (yds)",
        "FAIRWAY (%)",
        "POOR SHOT (%)",
        // "GREAT SHOT (%)",
        "FREQUENCY",
        "TOTAL SHOTS",
        "SHOTS/ROUND",
    ];

    const firstRow: OTTTableData = {
        club: "Total",
        sgPerRound: averageSGOTTForAllRounds || 0,
        sgPerShot: averageSGOTTForAllShots || 0,
        // avgDistance: avgAdjustedTeeShotDistance || 0,
        fairwayAccuracy: fairwayAccuracyPercentage || 0,
        poorTeeShots: poorTeeShotsPercentage || 0,
        // greatTeeShots: greatTeeShotsPercentage || 0,
        frequency: 100,
        totalShots: totalOTTShots,
        shotsPerRound: avgSPRTeeShots,
    };

    return {
        averageSGOTTForAllRounds,
        averageSGOTTForAllShots,
        averageSGOTTForAllRoundsPar4,
        averageSGOTTForAllRoundsPar5,
        offTheTeeChartData,
        offTheTeeLabels,
        fairwayAccuracyPercentage,
        poorTeeShotsPercentage,
        avgSPRTeeShots,
        avgAdjustedTeeShotDistance,
        tableColumns,
        streamed: {
            firstRow,
            tableDataOTT,
        },
    };
}) satisfies PageServerLoad;
