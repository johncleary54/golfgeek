import { writable } from "svelte/store";

export const pagination = writable({ currentPage: 1, pageCount: 0 });

type Pagination<T> = {
    pagination: typeof pagination;
    onNextPage: () => void;
    onPrevPage: () => void;
    goToPage: (index: number) => void;
    calcPageCount: (dataCount: number) => void;
    currentPageData: (array: T[], currentPage: number) => T[];
};

// TODO: use data
export function usePagination<T>(_data: T[], pageSize = 8): Pagination<T> {
    const onNextPage = (): void => {
        pagination.update((d) => {
            const newPage = d.currentPage + 1;
            if (newPage <= d.pageCount) {
                return { ...d, currentPage: newPage };
            }
            return { ...d };
        });
    };

    const onPrevPage = (): void => {
        pagination.update((d) => {
            const newPage = d.currentPage - 1;
            if (newPage > 0) {
                return { ...d, currentPage: newPage };
            }
            return { ...d };
        });
    };

    const goToPage = (index: number): void =>
        pagination.update((d) => ({ ...d, currentPage: index }));

    const calcPageCount = (dataCount: number): void => {
        pagination.update((d) => {
            const pageCount = Math.ceil(dataCount / pageSize);
            return { ...d, pageCount };
        });
    };

    const currentPageData = (array: T[], currentPage: number): T[] => {
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = Math.min(currentPage * pageSize, array.length);
        return array.slice(startIdx, endIdx);
    };

    return {
        pagination,
        onNextPage,
        onPrevPage,
        goToPage,
        calcPageCount,
        currentPageData,
    };
}
