import { ShortGameDistanceBucket } from "$lib/types";

export const TOUR_AVERAGES_SHORT_GAME_PROXIMITY: {
    fairway: Record<ShortGameDistanceBucket, number>;
    rough: Record<ShortGameDistanceBucket, number>;
    sand: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 1.83138660159714,
        [ShortGameDistanceBucket.ShortGame_26_50]: 3.78721812275207,
        [ShortGameDistanceBucket.ShortGame_51_75]: 5.52673272458044,
        [ShortGameDistanceBucket.ShortGame_76_100]: 6.01251418125414,
    },
    rough: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 3.30798335588632,
        [ShortGameDistanceBucket.ShortGame_26_50]: 5.47331743208278,
        [ShortGameDistanceBucket.ShortGame_51_75]: 8.47208069458631,
        [ShortGameDistanceBucket.ShortGame_76_100]: 9.98219757281552,
    },
    sand: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 3.8076,
        [ShortGameDistanceBucket.ShortGame_26_50]: 4.2356414156186,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const TOUR_AVERAGE_SHORT_GAME_GREEN_HIT_PERCENTAGE: {
    fairway: Record<ShortGameDistanceBucket, number>;
    rough: Record<ShortGameDistanceBucket, number>;
    sand: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 97.1584861028977 / 100,
        [ShortGameDistanceBucket.ShortGame_26_50]: 92.650462962963 / 100,
        [ShortGameDistanceBucket.ShortGame_51_75]: 86.3725973385904 / 100,
        [ShortGameDistanceBucket.ShortGame_76_100]: 84.9933745583039 / 100,
    },
    rough: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 89.35 / 100,
        [ShortGameDistanceBucket.ShortGame_26_50]: 82.1227250765019 / 100,
        [ShortGameDistanceBucket.ShortGame_51_75]: 70.7019328585961 / 100,
        [ShortGameDistanceBucket.ShortGame_76_100]: 66.3280116110305 / 100,
    },
    sand: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 88.76 / 100,
        [ShortGameDistanceBucket.ShortGame_26_50]: 91.3818288051417 / 100,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const TOUR_AVERAGES_SHORT_GAME_HOLE_OUT: {
    fairway: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 4.57717327025429 / 100,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const SHORT_GAME_HOLE_OUT_STDDEV: {
    fairway: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.015604,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const SHORT_GAME_PROXIMITY_STDDEV: {
    fairway: Record<ShortGameDistanceBucket, number>;
    rough: Record<ShortGameDistanceBucket, number>;
    sand: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.209279,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0.534470475,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0.750645499,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0.635846045,
    },
    rough: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.649741922,
        [ShortGameDistanceBucket.ShortGame_26_50]: 1.209892747,
        [ShortGameDistanceBucket.ShortGame_51_75]: 2.022604,
        [ShortGameDistanceBucket.ShortGame_76_100]: 1.902578,
    },
    sand: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.485423,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const SHORT_GAME_GREEN_HIT_PERCENTAGE_STDDEV: {
    fairway: Record<ShortGameDistanceBucket, number>;
    rough: Record<ShortGameDistanceBucket, number>;
    sand: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0.036938566,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0.047277734,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0.055068952,
    },
    rough: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.038755949,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0.079594943,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0.097561,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0.090957,
    },
    sand: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.04434,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const SHORT_GAME_HOLE_OUT_COEFFICIENT: {
    fairway: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.014966581,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const SHORT_GAME_PROXIMITY_COEFFICIENT: {
    fairway: Record<ShortGameDistanceBucket, number>;
    rough: Record<ShortGameDistanceBucket, number>;
    sand: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: -0.026219498,
        [ShortGameDistanceBucket.ShortGame_26_50]: -0.0417554,
        [ShortGameDistanceBucket.ShortGame_51_75]: -0.050215692,
        [ShortGameDistanceBucket.ShortGame_76_100]: -0.0373824,
    },
    rough: {
        [ShortGameDistanceBucket.ShortGame_0_25]: -0.0587059,
        [ShortGameDistanceBucket.ShortGame_26_50]: -0.075684,
        [ShortGameDistanceBucket.ShortGame_51_75]: -0.0648795,
        [ShortGameDistanceBucket.ShortGame_76_100]: -0.0483149,
    },
    sand: {
        [ShortGameDistanceBucket.ShortGame_0_25]: -0.0426544,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const SHORT_GAME_GREEN_HIT_PERCENTAGE_COEFFICIENT: {
    fairway: Record<ShortGameDistanceBucket, number>;
    rough: Record<ShortGameDistanceBucket, number>;
    sand: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.014966581,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0.0114704,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0.013356393,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0.01113804,
    },
    rough: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.01635921,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0.01936278,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0.04035264,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0.04300832,
    },
    sand: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.0158567,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};

export const SHORT_GAME_FIXED_VALUE: {
    fairway: Record<ShortGameDistanceBucket, number>;
    rough: Record<ShortGameDistanceBucket, number>;
    sand: Record<ShortGameDistanceBucket, number>;
} = {
    fairway: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.01151221,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0.04760173,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0.044804678,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0.0320348,
    },
    rough: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.12449234,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0.13394826,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0.06962778,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0.01192564,
    },
    sand: {
        [ShortGameDistanceBucket.ShortGame_0_25]: 0.02025253,
        [ShortGameDistanceBucket.ShortGame_26_50]: 0,
        [ShortGameDistanceBucket.ShortGame_51_75]: 0,
        [ShortGameDistanceBucket.ShortGame_76_100]: 0,
    },
};
