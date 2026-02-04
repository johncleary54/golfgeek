import type { Hole } from "../rounds/hole.service";
import type { Shot } from "../rounds/shot.service";
import { isOTTShot } from "./ShotTypeUtils";

export class BaseCalculator {
    shots: Shot[];
    holes: Hole[];

    constructor(shots: Shot[], holes: Hole[]) {
        this.shots = shots;
        this.holes = holes;
    }

    calcTotalPar(): number {
        let totalPar = 0;
        for (const hole of this.holes) {
            totalPar += hole.par;
        }
        return totalPar;
    }

    calcTotalScore(): number {
        return this.shots.length;
    }

    calcOTTShots(): number {
        let totalOTTShots = 0;
        for (const currentShot of this.shots) {
            const hole = this.holes.find((h) => h.hole === currentShot.hole);

            if (!hole) {
                continue;
            }

            if (isOTTShot({ location: currentShot.location, par: hole.par })) {
                totalOTTShots++;
            }
        }
        return totalOTTShots;
    }
}
