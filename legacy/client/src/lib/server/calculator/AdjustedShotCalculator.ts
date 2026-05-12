import baselineData from "../../../data/baseline.json";
import { feetToYards, yardsToFeet } from "$lib/utils";
import { ShotLocation, type BaselineData } from "$lib/types";
import type { Shot } from "../rounds/shot.service";

function calcTourAverageYards(
    location: ShotLocation,
    distance: number,
    field: keyof Pick<
        BaselineData,
        "avgProximityTour" | "avgTeeShotDistTour" | "greenHitTourPercentage"
    >,
): number {
    const baseline = baselineData.find(
        (b: BaselineData) => b.location === location && b.distanceYards === distance,
    ) as BaselineData;

    const value = baseline[field] ?? 0;

    return value;
}

function calcTourAverageFeet(
    location: ShotLocation,
    distance: number,
    field: keyof Pick<
        BaselineData,
        "avgProximityTour" | "avgTeeShotDistTour" | "greenHitTourPercentage"
    >,
): number {
    const baseline = baselineData.find(
        (b: BaselineData) => b.location === location && b.distanceFeet === distance,
    ) as BaselineData;

    const value = yardsToFeet(baseline[field] ?? 0) || 0;

    return value;
}

function calcTourAverageOnePuttPct({
    location,
    distance,
}: {
    location: ShotLocation;
    distance: number;
}): number {
    const baseline = baselineData.find(
        (b: BaselineData) => b.location === location && b.distanceFeet === distance,
    ) as BaselineData;

    const onePuttTourPercentage = baseline.onePuttTourPercentage ?? 0;

    return onePuttTourPercentage;
}

function calcTourAverageAdjustedHoleOutPct({
    location,
    distance,
}: {
    location: ShotLocation;
    distance: number;
}): number {
    const baseline = baselineData.find(
        (b: BaselineData) => b.location === location && b.distanceYards === distance,
    ) as BaselineData;

    const holeOutTourPercentage = baseline.onePuttTourPercentage ?? 0;

    return holeOutTourPercentage;
}

// TODO: Refactor messy code and remove duplication
function calculateAdjustedProximityPuttingLogic(
    shot: Shot,
    nextShot: Shot | undefined,
    tourAverageField: keyof Pick<BaselineData, "avgProximityTour">,
): number {
    let avgProximity = 0;
    const distance = shot.distance;
    const location = shot.location;

    if (!nextShot) {
        let tourAverageProximity = 0;

        tourAverageProximity = calcTourAverageFeet(location, distance, tourAverageField);

        avgProximity = -tourAverageProximity;
    } else {
        if (nextShot.location === ShotLocation.Penalty) {
            return avgProximity;
        }

        const nextShotDistance = nextShot.distance;

        let tourAverageProximity = 0;

        tourAverageProximity = calcTourAverageFeet(location, distance, tourAverageField);

        avgProximity = nextShotDistance - tourAverageProximity;
    }

    return avgProximity;
}

function calculateAdjustedProximityLogic(
    shot: Shot,
    nextShot: Shot | undefined,
    tourAverageField: keyof Pick<BaselineData, "avgProximityTour">,
): number {
    let avgProximity = 0;
    const distance = shot.distance;
    const location = shot.location;

    if (!nextShot) {
        let tourAverageProximity = 0;
        tourAverageProximity = calcTourAverageYards(location, distance, tourAverageField);

        avgProximity = -tourAverageProximity;
    } else {
        if (nextShot.location === ShotLocation.Penalty) {
            return avgProximity;
        }

        let nextShotDistance = nextShot.distance;

        if (nextShot.location === ShotLocation.Green) {
            nextShotDistance = feetToYards(nextShotDistance);
        }

        let tourAverageProximity = 0;
        tourAverageProximity = calcTourAverageYards(location, distance, tourAverageField);

        avgProximity = nextShotDistance - tourAverageProximity;
    }

    return avgProximity;
}

type AdjustedShotCalculatorReturn = {
    calculateAdjustedOnePutt(): number;
    calculateAdjustedHoleOut(): number;
    calculateAdjustedProximityPutting(): number;
    calculateAdjustedTeeShotDistance(): number;
    calculateAdjustedApproachProximity(): number;
    calculateAdjustedGreenHit(): number;
    calculateAdjustedShortGameProximity(): number;
};

export class AdjustedShotCalculator implements AdjustedShotCalculatorReturn {
    shot: Shot;
    nextShot: Shot | undefined = undefined;

    constructor(shot: Shot, nextShot: Shot | undefined) {
        this.shot = shot;
        this.nextShot = nextShot;
    }

    calculateAdjustedOnePutt(): number {
        const distance = this.shot.distance;
        const location = this.shot.location;
        const onePuttPct = calcTourAverageOnePuttPct({
            location,
            distance,
        });
        const onePuttAdj = 1 - onePuttPct;
        const missedPuttAdj = -onePuttPct;

        return this.nextShot ? missedPuttAdj : onePuttAdj;
    }

    calculateAdjustedHoleOut(): number {
        const distance = this.shot.distance;
        const location = this.shot.location;

        const holeOutPct = calcTourAverageAdjustedHoleOutPct({
            location,
            distance,
        });

        const holeOutAdj = 1 - holeOutPct;
        const missedHoleOutAdj = -holeOutPct;

        return this.nextShot ? missedHoleOutAdj : holeOutAdj;
    }

    calculateAdjustedProximityPutting(): number {
        return calculateAdjustedProximityPuttingLogic(this.shot, this.nextShot, "avgProximityTour");
    }

    calculateAdjustedTeeShotDistance(): number {
        let adjustedTeeShotDistance = 0;

        const distance = this.shot.distance;
        const location = this.shot.location;

        if (this.nextShot && this.nextShot.location !== ShotLocation.Penalty) {
            const teeShotDistance = distance - this.nextShot.distance;

            const tourAvg = calcTourAverageYards(location, distance, "avgTeeShotDistTour");

            adjustedTeeShotDistance = teeShotDistance - tourAvg;
        }

        return adjustedTeeShotDistance;
    }

    calculateAdjustedApproachProximity(): number {
        return calculateAdjustedProximityLogic(this.shot, this.nextShot, "avgProximityTour");
    }

    calculateAdjustedGreenHit(): number {
        const distance = this.shot.distance;
        const location = this.shot.location;

        const greenHitPctTour = calcTourAverageYards(location, distance, "greenHitTourPercentage");

        const playerHitGreen = this.nextShot?.location === ShotLocation.Green ? 1 : 0; // Assuming the player either hits (1) or misses (0) the green
        const adjGreenHit = +(playerHitGreen - greenHitPctTour);

        return adjGreenHit;
    }

    calculateAdjustedShortGameProximity(): number {
        return calculateAdjustedProximityLogic(this.shot, this.nextShot, "avgProximityTour");
    }
}
