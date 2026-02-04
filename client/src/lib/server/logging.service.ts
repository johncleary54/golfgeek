import { ENV } from "$env/static/private";

export function perf(name: string): () => void  {
    if (ENV === "production") {
        return () => {
            // do nothing
        };
    }
    const start = performance.now();

    function end(): void {
        const duration = performance.now() - start;
        console.info(`${name}: ${duration.toFixed(4)}ms`);
    }

    return end;
}
