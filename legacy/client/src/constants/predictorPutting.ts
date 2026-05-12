import { PuttingDistanceBucket } from "$lib/types";

export const TOUR_AVERAGES_ONE_PUTT: Record<PuttingDistanceBucket, number> = {
    [PuttingDistanceBucket.Putting_0_2]: 0.9979316338992,
    [PuttingDistanceBucket.Putting_3_5]: 0.908083532403483,
    [PuttingDistanceBucket.Putting_6_9]: 0.557977987610513,
    [PuttingDistanceBucket.Putting_10_15]: 0.314279800100541,
    [PuttingDistanceBucket.Putting_16_25]: 0.155311481036554,
    [PuttingDistanceBucket.Putting_26_40]: 0.0711065221132335,
    [PuttingDistanceBucket.Putting_41_60]: 0.0323278972434695,
    [PuttingDistanceBucket.Putting_61Plus]: 0.0160175879396985,
};

export const TOUR_AVERAGES_PROXIMITY_PUTTING_YARDS: Record<PuttingDistanceBucket, number> = {
    [PuttingDistanceBucket.Putting_0_2]: 0,
    [PuttingDistanceBucket.Putting_3_5]: 0,
    [PuttingDistanceBucket.Putting_6_9]: 0,
    [PuttingDistanceBucket.Putting_10_15]: 0,
    [PuttingDistanceBucket.Putting_16_25]: 1.751472627 / 3,
    [PuttingDistanceBucket.Putting_26_40]: 2.464884564 / 3,
    [PuttingDistanceBucket.Putting_41_60]: 3.826583778 / 3,
    [PuttingDistanceBucket.Putting_61Plus]: 5.877502198 / 3,
};

// TODO: The values above work correctly but they are old values. The new ones give slightly off results.
// Fix with John on monday

// const TOUR_AVERAGES_PROXIMITY_PUTTING_YARDS: Record<PuttingDistanceBucket, number> = {
//     [PuttingDistanceBucket.Putting_0_2]: 0,
//     [PuttingDistanceBucket.Putting_3_5]: 0,
//     [PuttingDistanceBucket.Putting_6_9]: 0,
//     [PuttingDistanceBucket.Putting_10_15]: 0,
//     [PuttingDistanceBucket.Putting_16_25]: 0.483224648,
//     [PuttingDistanceBucket.Putting_26_40]: 0.753612359,
//     [PuttingDistanceBucket.Putting_41_60]: 1.228186443,
//     [PuttingDistanceBucket.Putting_61Plus]: 2.02,
// };

export const PROXIMITY_PUTTING_STDDEV: Record<PuttingDistanceBucket, number> = {
    [PuttingDistanceBucket.Putting_0_2]: 0,
    [PuttingDistanceBucket.Putting_3_5]: 0,
    [PuttingDistanceBucket.Putting_6_9]: 0,
    [PuttingDistanceBucket.Putting_10_15]: 0,
    [PuttingDistanceBucket.Putting_16_25]: 0.06433587,
    [PuttingDistanceBucket.Putting_26_40]: 0.091763273,
    [PuttingDistanceBucket.Putting_41_60]: 0.116168484,
    [PuttingDistanceBucket.Putting_61Plus]: 0.303816,
};

export const ONE_PUTT_STDDEV: Record<PuttingDistanceBucket, number> = {
    [PuttingDistanceBucket.Putting_0_2]: 0.002463,
    [PuttingDistanceBucket.Putting_3_5]: 0.04199531,
    [PuttingDistanceBucket.Putting_6_9]: 0.07560884,
    [PuttingDistanceBucket.Putting_10_15]: 0.065672644,
    [PuttingDistanceBucket.Putting_16_25]: 0.048625639,
    [PuttingDistanceBucket.Putting_26_40]: 0.036007966,
    [PuttingDistanceBucket.Putting_41_60]: 0.01846949,
    [PuttingDistanceBucket.Putting_61Plus]: 0.017311,
};

export const PUTTING_FIXED_VALUE: Record<PuttingDistanceBucket, number> = {
    [PuttingDistanceBucket.Putting_0_2]: -0.00054134,
    [PuttingDistanceBucket.Putting_3_5]: 0.00390151127827658,
    [PuttingDistanceBucket.Putting_6_9]: -0.00202189701372291,
    [PuttingDistanceBucket.Putting_10_15]: 0.00239398056029385,
    [PuttingDistanceBucket.Putting_16_25]: 0.0038338289847047,
    [PuttingDistanceBucket.Putting_26_40]: 0.0031338479759019,
    [PuttingDistanceBucket.Putting_41_60]: -0.000502562543504113,
    [PuttingDistanceBucket.Putting_61Plus]: 0.028798532,
};

export const ONE_PUTT_COEFFICIENT: Record<PuttingDistanceBucket, number> = {
    [PuttingDistanceBucket.Putting_0_2]: 0.00274409,
    [PuttingDistanceBucket.Putting_3_5]: 0.0426281410248283,
    [PuttingDistanceBucket.Putting_6_9]: 0.0762466518710783,
    [PuttingDistanceBucket.Putting_10_15]: 0.0662018698478175,
    [PuttingDistanceBucket.Putting_16_25]: 0.0461035708189411,
    [PuttingDistanceBucket.Putting_26_40]: 0.0331457693724748,
    [PuttingDistanceBucket.Putting_41_60]: 0.0171619430995169,
    [PuttingDistanceBucket.Putting_61Plus]: 0.017173918,
};

export const PROXIMITY_PUTTING_COEFFICIENT: Record<PuttingDistanceBucket, number> = {
    [PuttingDistanceBucket.Putting_0_2]: 0,
    [PuttingDistanceBucket.Putting_3_5]: 0,
    [PuttingDistanceBucket.Putting_6_9]: 0,
    [PuttingDistanceBucket.Putting_10_15]: 0,
    [PuttingDistanceBucket.Putting_16_25]: -0.00755844140609056,
    [PuttingDistanceBucket.Putting_26_40]: -0.0156581315435644,
    [PuttingDistanceBucket.Putting_41_60]: -0.0203785754306051,
    [PuttingDistanceBucket.Putting_61Plus]: -0.053685136,
};
