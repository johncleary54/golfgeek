// Auth

import type { Writable } from "svelte/store";
import type { PredictorType } from "../routes/(app)/predictor/predictor.type";

export type User = {
    id: string;
    email: string;
    stripeId: string;
    subscriptionEnd: string | undefined;
    subscriptionCheck: string | undefined;
};

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

// baseline.json

export type BaselineData = {
    location: ShotLocation;
    distanceFeet: number;
    distanceMeters: number;
    distanceYards: number;
    baseline: number;
    avgTeeShotDistTour?: number;
    avgProximityTour?: number;
    onePuttTourPercentage?: number;
    greenHitTourPercentage?: number;
};

// Tabs
export enum Tab {
    OffTheTee = "OFF_THE_TEE",
    Approach = "APPROACH",
    ShortGame = "SHORT_GAME",
    Putting = "PUTTING",
}

export enum AnalysisTab {
    StrokesGained = "strokes-gained",
    KPIs = "kpis",
    Scoring = "scoring",
}

// Rounds

export enum ShotLocation {
    Tee = "Tee",
    Fairway = "Fairway",
    Rough = "Rough",
    Sand = "Sand",
    HeavyRough = "Heavy rough",
    Recovery = "Recovery",
    Green = "Green",
    Penalty = "Penalty",
    Unknown = "",
}

export enum ShotClub {
    None = "None",
    Driver = "Driver",
    Wood3 = "3 Wood",
    Wood5 = "5 Wood",
    Iron3 = "3 Iron",
    Iron4 = "4 Iron",
    Iron5 = "5 Iron",
    Iron6 = "6 Iron",
    Iron7 = "7 Iron",
    Iron8 = "8 Iron",
    Iron9 = "9 Iron",
    PitchingWedge = "Pitching Wedge",
    GapWedge = "Gap Wedge",
    SandWedge = "Sand Wedge",
    LobWedge = "Lob Wedge",
    Putter = "Putter",
    Unknown = "",
}

export enum ApproachType {
    Round = "round",
    Shot = "shot",
}

export enum ApproachDistanceBucket {
    Approach_101_150 = "101-150",
    Approach_151_200 = "151-200",
    Approach_201_250 = "201-250",
    Approach_251Plus = "251+",
}

export enum ShortGameDistanceBucket {
    ShortGame_0_25 = "0-25",
    ShortGame_26_50 = "26-50",
    ShortGame_51_75 = "51-75",
    ShortGame_76_100 = "76-100",
}

export enum PuttingDistanceBucket {
    Putting_0_2 = "0-2",
    Putting_3_5 = "3-5",
    Putting_6_9 = "6-9",
    Putting_10_15 = "10-15",
    Putting_16_25 = "16-25",
    Putting_26_40 = "26-40",
    Putting_41_60 = "41-60",
    Putting_61Plus = "61+",
}

export type SliderData = {
    title: string;
    tooltip: string;
    sliderValue: Writable<number[]>;
    unit: string;
    maxRange: number;
    type: PredictorType;
};
