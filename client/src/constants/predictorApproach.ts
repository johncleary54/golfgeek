import { ApproachDistanceBucket } from "$lib/types";

export const TOUR_AVERAGES_APPROACH_PROXIMITY: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 7.6901261652748,
        [ApproachDistanceBucket.Approach_151_200]: 10.939844107196,
        [ApproachDistanceBucket.Approach_201_250]: 16.6359404134576,
        [ApproachDistanceBucket.Approach_251Plus]: 49.147690576877,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 12.6905117036434,
        [ApproachDistanceBucket.Approach_151_200]: 17.0683193194976,
        [ApproachDistanceBucket.Approach_201_250]: 34.8328104191148,
        [ApproachDistanceBucket.Approach_251Plus]: 86.136716563786,
    },
};

export const TOUR_AVERAGE_APPROACH_GREEN_HIT_PERCENTAGE: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 78.342935660391 / 100,
        [ApproachDistanceBucket.Approach_151_200]: 65.2429967876757 / 100,
        [ApproachDistanceBucket.Approach_201_250]: 44.5775460659848 / 100,
        [ApproachDistanceBucket.Approach_251Plus]: 10.9288336848683 / 100,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 57.2848017844469 / 100,
        [ApproachDistanceBucket.Approach_151_200]: 42.3811207353721 / 100,
        [ApproachDistanceBucket.Approach_201_250]: 16.9331535349644 / 100,
        [ApproachDistanceBucket.Approach_251Plus]: 3.24553950722175 / 100,
    },
};

export const APPROACH_PROXIMITY_STDDEV: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 0.7839,
        [ApproachDistanceBucket.Approach_151_200]: 0.816118,
        [ApproachDistanceBucket.Approach_201_250]: 1.409021,
        [ApproachDistanceBucket.Approach_251Plus]: 10.50616638,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 1.76,
        [ApproachDistanceBucket.Approach_151_200]: 2.820619,
        [ApproachDistanceBucket.Approach_201_250]: 2.820619,
        [ApproachDistanceBucket.Approach_251Plus]: 17.66041854,
    },
};

export const APPROACH_GREEN_HIT_PERCENTAGE_STDDEV: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 0.059325905,
        [ApproachDistanceBucket.Approach_151_200]: 0.078932,
        [ApproachDistanceBucket.Approach_201_250]: 0.092254,
        [ApproachDistanceBucket.Approach_251Plus]: 0.047162376,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 0.0769,
        [ApproachDistanceBucket.Approach_151_200]: 0.09363,
        [ApproachDistanceBucket.Approach_201_250]: 0.09363,
        [ApproachDistanceBucket.Approach_251Plus]: 0.031819893,
    },
};

export const APPROACH_POOR_SHOT_PERCENTAGE_STDDEV: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 0,
        [ApproachDistanceBucket.Approach_151_200]: 0.030242,
        [ApproachDistanceBucket.Approach_201_250]: 0.028938,
        [ApproachDistanceBucket.Approach_251Plus]: 0.034784504,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 0,
        [ApproachDistanceBucket.Approach_151_200]: 0.026267,
        [ApproachDistanceBucket.Approach_201_250]: 0.026267,
        [ApproachDistanceBucket.Approach_251Plus]: 0.025610676,
    },
};

export const APPROACH_POOR_SHOT_PERCENTAGE_MEAN: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 0,
        [ApproachDistanceBucket.Approach_151_200]: 0.074967532,
        [ApproachDistanceBucket.Approach_201_250]: 0.063,
        [ApproachDistanceBucket.Approach_251Plus]: 0.053804878,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 0,
        [ApproachDistanceBucket.Approach_151_200]: 0.041356,
        [ApproachDistanceBucket.Approach_201_250]: 0.045333333,
        [ApproachDistanceBucket.Approach_251Plus]: 0.035516224,
    },
};

export const APPROACH_PROXIMITY_COEFFICIENT: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: -0.044270836,
        [ApproachDistanceBucket.Approach_151_200]: -0.023897126,
        [ApproachDistanceBucket.Approach_201_250]: -0.015153527,
        [ApproachDistanceBucket.Approach_251Plus]: -0.03357657,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: -0.043847535,
        [ApproachDistanceBucket.Approach_151_200]: -0.0383547,
        [ApproachDistanceBucket.Approach_201_250]: -0.0370961,
        [ApproachDistanceBucket.Approach_251Plus]: -0.0455256,
    },
};

export const APPROACH_GREEN_HIT_PERCENTAGE_COEFFICIENT: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 0.02020912,
        [ApproachDistanceBucket.Approach_151_200]: 0.024929593,
        [ApproachDistanceBucket.Approach_201_250]: 0.030278777,
        [ApproachDistanceBucket.Approach_251Plus]: 0.020334622,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 0.027771628,
        [ApproachDistanceBucket.Approach_151_200]: 0.03598722,
        [ApproachDistanceBucket.Approach_201_250]: 0.03393214,
        [ApproachDistanceBucket.Approach_251Plus]: 0.01944813,
    },
};

export const APPROACH_POOR_SHOT_PERCENTAGE_COEFFICIENT: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 0,
        [ApproachDistanceBucket.Approach_151_200]: -0.018068041,
        [ApproachDistanceBucket.Approach_201_250]: -0.027684859,
        [ApproachDistanceBucket.Approach_251Plus]: -0.046529046,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 0,
        [ApproachDistanceBucket.Approach_151_200]: -0.0171117,
        [ApproachDistanceBucket.Approach_201_250]: -0.0281285,
        [ApproachDistanceBucket.Approach_251Plus]: -0.0263115,
    },
};

export const APPROACH_FIXED_VALUE: {
    fairway: Record<ApproachDistanceBucket, number>;
    rough: Record<ApproachDistanceBucket, number>;
} = {
    fairway: {
        [ApproachDistanceBucket.Approach_101_150]: 0.024408103,
        [ApproachDistanceBucket.Approach_151_200]: 0.01770536,
        [ApproachDistanceBucket.Approach_201_250]: 0.006130076,
        [ApproachDistanceBucket.Approach_251Plus]: 0.054997491,
    },
    rough: {
        [ApproachDistanceBucket.Approach_101_150]: 0.04020248,
        [ApproachDistanceBucket.Approach_151_200]: 0.05644054,
        [ApproachDistanceBucket.Approach_201_250]: 0.07231211,
        [ApproachDistanceBucket.Approach_251Plus]: 0.03975417,
    },
};
