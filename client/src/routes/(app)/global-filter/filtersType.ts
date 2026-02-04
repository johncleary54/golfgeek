// store.ts
export type Filter = {
    courseId: string;
    courseName: string;
    fromDate: string;
    toDate: string;
    teeTime: string;
    roundType: string;
    temperature: string;
    wind: string;
    precipitation: string;
    firmness: string;
    height: string;
    smoothness: string;
    speed: string;
    score: string;
    quickAction: string;
};

export enum Temperatures {
    VeryCold = "Very Cold",
    Cold = "Cold",
    Normal = "Normal",
    Warm = "Warm",
    VeryWarm = "Very Warm",
}

export enum Winds {
    Calm = "Calm",
    LightBreeze = "Light Breeze",
    ModerateBreeze = "Moderate Breeze",
    StrongBreeze = "Strong Breeze",
    Gale = "Gale",
}

export enum Precipitations {
    NoRain = "No Rain",
    LightRain = "Light Rain",
    ModerateRain = "Moderate Rain",
    HeavyRain = "Heavy Rain",
    VeryHeavyRain = "Very Heavy Rain",
}

export enum RoundTypes {
    Practice = "Casual",
    Tournament = "Tournament",
}

export enum GolfScores {
    Score70 = "70",
    Score70to75 = "70-75",
    Score75to80 = "75-80",
    Score80to85 = "80-85",
    Score85to90 = "85-90",
    Score90Plus = "90+",
}

export enum QuickActions {
    Last5Rounds = "Last 5 Rounds",
    Last10Rounds = "Last 10 Rounds",
    Last20Rounds = "Last 20 Rounds",
}

export enum Firmness {
    VerySoft = "Very Soft",
    Soft = "Soft",
    Normal = "Normal",
    Firm = "Firm",
    VeryFirm = "Very Firm",
}

export enum Height {
    VeryShort = "Very Short",
    Short = "Short",
    Average = "Average",
    Long = "Long",
    VeryLong = "Very Long",
}

export enum Smoothness {
    VerySmooth = "Very Smooth",
    Smooth = "Smooth",
    Average = "Average",
    Bumpy = "Bumpy",
    VeryBumpy = "Very Bumpy",
}

export enum Speed {
    VerySlow = "Very Slow",
    Slow = "Slow",
    Normal = "Normal",
    Fast = "Fast",
    VeryFast = "Very Fast",
}
