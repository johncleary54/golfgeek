<script lang="ts">
    import type { Shot } from "$lib/server/rounds/shot.service";
    import { getContext } from "svelte";
    import type { Context } from "./context";
    import type { Hole } from "$lib/server/rounds/hole.service";
    import { ShotLocation } from "$lib/types";

    const { data, activeHole, shotForm } = getContext<Context>("context");

    function setActiveHole(index: number): void {
        shotForm.set({
            id: "",
            shotNumber: "",
            location: ShotLocation.Unknown,
            distance: "",
            club: "",
            tags: "",
        });
        activeHole.set(index);
    }

    function calcScoreByHole(shots: Shot[]): Record<number, string> {
        let scoreByHole: Record<number, string> = {};
        for (let i = 0; i < 18; i++) {
            const holeShots = shots.filter((shot) => shot.hole === i + 1).length;
            scoreByHole[i + 1] = holeShots ? String(holeShots) : "-";
        }
        return scoreByHole;
    }
    $: scoreByHole = calcScoreByHole($data.shots);

    function calcParTotal(holes: Hole[]): number {
        let parTotal = 0;
        for (let i = 0; i < 18; i++) {
            const holePar = holes.find((hole) => hole.hole === i + 1)?.par;
            if (holePar) {
                parTotal += holePar;
            }
        }
        return parTotal;
    }
    $: parTotal = calcParTotal($data.holes);

    function calcTotalScore(shots: Shot[]): number {
        let totalScore = 0;
        for (let i = 0; i < 18; i++) {
            const holeShots = shots.filter((shot) => shot.hole === i + 1).length;
            totalScore += holeShots;
        }
        return totalScore;
    }
    $: scoreTotal = calcTotalScore($data.shots);

    function getOuterScoreFormatting(par: number, score: number, isActive: boolean): string {
        if (score !== score) {
            return "";
        }
        const difference = par - score;
        let formatting =
            "border-[1.5px] border-primary-600 w-7 h-7 flex items-center justify-center";
        if (isActive) {
            formatting += " border-white";
        }
        if (difference >= 1) {
            formatting += " rounded-full";
        }
        if (difference <= -1) {
            formatting;
        }

        return difference !== 0 ? formatting : "";
    }

    function getInnerScoreFormatting(par: number, score: number, isActive: boolean): string {
        if (score !== score) {
            return "";
        }
        const difference = par - score;
        let formatting =
            "border-[1.5px] border-primary-600 w-5 h-5 flex items-center justify-center";
        if (isActive) {
            formatting += " border-white";
        }
        if (difference >= 2) {
            formatting += " rounded-full";
        }
        if (difference <= -2) {
            formatting;
        }

        return difference < 2 && difference > -2 ? "" : formatting;
    }
</script>

<div
    class="shadow-component col-span-2 h-fit w-full overflow-x-scroll rounded-lg border border-neutral-100"
>
    <div class="flex text-sm text-white">
        <div class="min-w-[4rem] flex-1 border-r border-black bg-black px-3 py-2.5 text-center">
            Hole
        </div>
        {#each Array(18) as _, i}
            <button
                class="min-w-[4rem] flex-1 cursor-pointer justify-center whitespace-nowrap border-r border-black bg-black align-middle transition-colors duration-300 ease-in-out hover:bg-neutral-900 {$activeHole ===
                    i && 'bg-primary-600 hover:bg-primary-700 text-white'} {i === 17 &&
                    'border-neutral-75'}"
                on:click={() => {
                    setActiveHole(i);
                }}
            >
                {i + 1}
            </button>
        {/each}
        <div
            class="min-w-[4rem] flex-1 border-b border-neutral-100 bg-neutral-50 px-3 py-2.5 text-center text-neutral-900"
        >
            Total
        </div>
    </div>
    {#each Array(2) as _row, rowIndex}
        <div class="flex text-sm">
            <div
                class="min-w-[4rem] flex-1 border-r border-neutral-100 px-3 py-2.5 text-center {rowIndex ===
                    1 && 'border-t border-neutral-100'}"
            >
                {#if rowIndex === 0}
                    Par
                {:else}
                    Score
                {/if}
            </div>
            {#each Array(18) as _col, colIndex}
                <button
                    class="hover:bg-neutral-75 flex min-w-[4rem] flex-1 cursor-pointer items-center justify-center whitespace-nowrap border-r border-neutral-100 text-center align-middle transition-colors duration-300 ease-in-out {$activeHole ===
                        colIndex &&
                        'bg-primary-600 hover:bg-primary-700 border-t-0 text-white'} {rowIndex ===
                        1 && 'score-input border-t border-neutral-100 '} {rowIndex === 0 &&
                        'par-input '}"
                    on:click={() => {
                        setActiveHole(colIndex);
                    }}
                >
                    {#if rowIndex === 0}
                        {$data.holes.find((hole) => hole.hole === colIndex + 1)?.par ?? "-"}
                    {:else}
                        <span
                            class={getOuterScoreFormatting(
                                $data.holes.find((hole) => hole.hole === colIndex + 1)?.par ?? 0,
                                parseInt(scoreByHole[colIndex + 1] ?? "0"),
                                $activeHole === colIndex,
                            )}
                        >
                            <span
                                class={getInnerScoreFormatting(
                                    $data.holes.find((hole) => hole.hole === colIndex + 1)?.par ??
                                        0,
                                    parseInt(scoreByHole[colIndex + 1] ?? "0"),
                                    $activeHole === colIndex,
                                )}
                            >
                                {scoreByHole[colIndex + 1]}
                            </span>
                        </span>
                    {/if}
                </button>
            {/each}
            <div
                class="min-w-[4rem] flex-1 bg-white px-3 py-2.5 text-center {rowIndex === 1 &&
                    'border-t border-neutral-100'}"
            >
                {#if rowIndex === 0}
                    {parTotal}
                {:else}
                    {scoreTotal}
                {/if}
            </div>
        </div>
    {/each}
</div>
