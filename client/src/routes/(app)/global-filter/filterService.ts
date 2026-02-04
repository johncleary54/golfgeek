import { writable } from "svelte/store";
import type { Filter } from "./filtersType";

export const activeFilters = writable<Partial<Filter>>({});

export const selectedFilters = writable<Filter>({
    courseId: "",
    courseName: "",
    fromDate: "",
    toDate: "",
    teeTime: "",
    roundType: "",
    temperature: "",
    wind: "",
    precipitation: "",
    firmness: "",
    height: "",
    smoothness: "",
    speed: "",
    score: "",
    quickAction: "",
});

export function mountFilters(urlSearchParams: URLSearchParams): void {
    const filter: Filter = {
        courseId: urlSearchParams.get("courseId") ?? "",
        courseName: urlSearchParams.get("courseName") ?? "",
        fromDate: urlSearchParams.get("fromDate") ?? "",
        toDate: urlSearchParams.get("toDate") ?? "",
        teeTime: urlSearchParams.get("teeTime") ?? "",
        roundType: urlSearchParams.get("roundType") ?? "",
        temperature: urlSearchParams.get("temperature") ?? "",
        wind: urlSearchParams.get("wind") ?? "",
        precipitation: urlSearchParams.get("precipitation") ?? "",
        firmness: urlSearchParams.get("firmness") ?? "",
        height: urlSearchParams.get("height") ?? "",
        smoothness: urlSearchParams.get("smoothness") ?? "",
        speed: urlSearchParams.get("speed") ?? "",
        score: urlSearchParams.get("score") ?? "",
        quickAction: urlSearchParams.get("quickAction") ?? "",
    };
    activeFilters.set(filter);
    selectedFilters.set(filter);
}

const applyFilters = (filter: Filter): void => {
    let stringFilter = "";
    Object.entries(filter).forEach(([key, value]) => {
        if (!value) {
            return;
        } else if (typeof value === "string") {
            stringFilter += `${key}=${value}&`;
        }
    });

    const newUrl = `?${stringFilter}`;
    window.history.pushState({}, "", newUrl);

    window.location.reload();
};

const resetFilters = (): void => {
    selectedFilters.set({
        courseId: "",
        courseName: "",
        fromDate: "",
        toDate: "",
        teeTime: "",
        roundType: "",
        temperature: "",
        wind: "",
        precipitation: "",
        firmness: "",
        height: "",
        smoothness: "",
        speed: "",
        score: "",
        quickAction: "",
    });

    activeFilters.set({});

    window.history.pushState({}, "", "?");

    window.location.reload();
};

export { applyFilters, resetFilters };
