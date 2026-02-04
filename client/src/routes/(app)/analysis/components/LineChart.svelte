<script lang="ts">
    import Chart from "chart.js/auto";
    import type { ChartData, ChartOptions } from "chart.js";
    import { onMount, tick } from "svelte";

    export let min = -4;
    export let max = 4;
    export let sgData: number[];
    export let labels: string[];

    onMount(async () => {
        const element = document.getElementById("line-chart") as HTMLCanvasElement;
        const ctx = element.getContext("2d");
        if (!ctx) return;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgb(64, 146, 149, 0.0)"); // * Can add opacity back here to see gradient
        gradient.addColorStop(1, "rgb(64, 146, 149, 0)");

        ctx.canvas.width = 300;
        ctx.canvas.height = 300;

        await tick();
        const data: ChartData = {
            labels: labels,
            datasets: [
                {
                    label: "Strokes Gained",
                    data: sgData,
                    fill: true,
                    backgroundColor: gradient,
                    borderColor: "#409295",
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#409295",
                    pointHoverBackgroundColor: "#409295",
                    pointHoverBorderColor: "#409295",
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointHitRadius: 10,
                    pointBorderWidth: 3,
                    pointStyle: "circle",
                },
                {
                    type: "line",
                    label: "Average Line",
                    data: Array(20).fill(0) as number[],
                    fill: false,
                    borderColor: "#E7572E",
                    borderWidth: 2,
                    pointRadius: 0,
                },
            ],
        };

        const options: ChartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false, // Hide x-axis labels
                    },
                },
                y: {
                    border: {
                        display: false,
                    },
                    min: min,
                    max: max,
                    grid: {
                        color: function (context) {
                            if (context.tick.value === 0) {
                                return "#CED2D9";
                            } else {
                                return "#DFE1E5";
                            }
                        },
                        lineWidth: function (context) {
                            if (context.tick.value === 0) {
                                return 2;
                            } else {
                                return 1;
                            }
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        };

        const chart = new Chart(ctx, {
            type: "line",
            data,
            options,
        });

        // Calculate and update the average line dataset
        const averageLineDataset = chart.data.datasets[1];
        let sum = 0;
        const datasets = chart.data.datasets[0]?.data;
        if (!datasets || !averageLineDataset) return;
        for (const value of datasets) {
            if (typeof value !== "number") continue;
            sum += value;
        }
        const average = sum / datasets.length;
        averageLineDataset.data = Array(labels.length).fill(average) as number[];
        chart.update();
    });
</script>

<canvas id="line-chart" />
