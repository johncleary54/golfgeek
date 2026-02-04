type TableData = {
    club: string;
    sgPerRound: number;
    sgPerShot: number;
    expSgPerShot: number;
    avgDistance: number;
    fairway: number;
    penalty: number;
    freq: number;
    totalShots: number;
    shotsPerRound: number;
    poorShot: number;
    greatShot: number;
};

export const tableData: TableData[] = [];

for (let i = 0; i < 20; i++) {
    const data: TableData = {
        club: "Driver",
        sgPerRound: Number(Math.random().toFixed(2)),
        sgPerShot: Number(Math.random().toFixed(2)),
        expSgPerShot: Number(Math.random().toFixed(2)),
        avgDistance: Number((Math.floor(Math.random() * 500) + 200).toFixed(2)),
        fairway: Number(Math.floor(Math.random() * 100).toFixed(2)),
        penalty: Number((Math.random() * 5).toFixed(2)),
        freq: Number(String(Math.floor(Math.random() * 100)) + "%"),
        totalShots: Number(Math.floor(Math.random() * 1000).toFixed(2)),
        shotsPerRound: Number(Math.floor(Math.random() * 30).toFixed(2)),
        poorShot: Number((Math.random() * 10).toFixed(2)),
        greatShot: Number((Math.random() * 10).toFixed(2)),
    };

    tableData.push(data);
}

export type MetricsDataType = {
    title: string;
    max: number;
    current: number;
    suffix: string;
    colour: string;
    difference: string;
    goal: string;
    tooltip: string;
};

export type BarType = "bar1" | "bar2" | "bar3" | "bar4"; // extend as needed

export type BarContext = Map<BarType, MetricsDataType>;

export const metricsData: BarContext = new Map<BarType, MetricsDataType>();

metricsData.set("bar1", {
    title: "Driving Distance",
    max: 400,
    current: 278,
    suffix: "yards",
    colour: "green",
    difference: "+0.62",
    goal: "298",
    tooltip: "Tooltip",
});
metricsData.set("bar2", {
    title: "Fairway Accuracy",
    max: 100,
    current: 62.5,
    suffix: "%",
    colour: "red",
    difference: "-0.62",
    goal: "75",
    tooltip: "Tooltip",
});
metricsData.set("bar3", {
    title: "Poor Drive %",
    max: 100,
    current: 15.15,
    suffix: "%",
    colour: "red",
    difference: "-0.22",
    goal: "75",
    tooltip: "Tooltip",
});

export const metricsData2: BarContext = new Map<BarType, MetricsDataType>();
metricsData2.set("bar1", {
    title: "Proximity",
    max: 100,
    current: 34,
    suffix: "ft",
    colour: "green",
    difference: "+1.62",
    goal: "33",
    tooltip: "Tooltip",
});
metricsData2.set("bar2", {
    title: "Green Hit",
    max: 100,
    current: 62.5,
    suffix: "%",
    colour: "red",
    difference: "-0.62",
    goal: "75",
    tooltip: "Tooltip",
});
metricsData2.set("bar3", {
    title: "Poor Shot %",
    max: 100,
    current: 15.15,
    suffix: "%",
    colour: "red",
    difference: "-0.22",
    goal: "75",
    tooltip: "Tooltip",
});
metricsData2.set("bar4", {
    title: "Great Shot %",
    max: 100,
    current: 50,
    suffix: "%",
    colour: "neutral",
    difference: "0.00",
    goal: "75",
    tooltip: "Tooltip",
});
