import { ShotLocation } from "$lib/types";

export function isApproachShot({
    location,
    distance,
    par,
}: {
    location: ShotLocation;
    distance: number;
    par: number;
}): boolean {
    if (location === ShotLocation.Penalty) {
        return false;
    }
    // If the location of the shot is not 'green', the shot distance is great than 100 yards,
    // and it's not a tee shot on a par 4 or 5, it is an approach shot, so return true
    if (
        location !== ShotLocation.Green &&
        distance > 100 &&
        !(location === ShotLocation.Tee && (par === 4 || par === 5))
    ) {
        return true;
    }

    return false;
}

export function isShortGameShot({
    location,
    distance,
    par,
}: {
    location: ShotLocation;
    distance: number;
    par: number;
}): boolean {
    if (location === ShotLocation.Penalty) {
        return false;
    }
    // If the location of the shot is not 'green', the shot distance is great than 100 yards,
    // and it's not a tee shot on a par 4 or 5, it is an approach shot, so return true
    if (
        location !== ShotLocation.Green &&
        distance <= 100 &&
        !(location === ShotLocation.Tee && (par === 4 || par === 5))
    ) {
        return true;
    }

    return false;
}

export function isOTTShot({ location, par }: { location: ShotLocation; par: number }): boolean {
    if (location === ShotLocation.Penalty) {
        return false;
    }

    if (location === ShotLocation.Tee && (par === 4 || par === 5)) {
        return true;
    }

    return false;
}
