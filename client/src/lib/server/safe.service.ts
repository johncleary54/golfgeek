export type Safe<T> =
    | {
          data: T;
          success: true;
      }
    | {
          success: false;
          error: string;
      };

export function safe<T>(promise: Promise<T>): Promise<Safe<T>>;
export function safe<T>(func: () => T): Safe<T>;
export function safe<T>(promiseOrFunc: Promise<T> | (() => T)): Promise<Safe<T>> | Safe<T> {
    if (promiseOrFunc instanceof Promise) {
        return safeAsync(promiseOrFunc);
    }
    return safeSync(promiseOrFunc);
}

export async function safeAsync<T>(promise: Promise<T>): Promise<Safe<T>> {
    try {
        const data = await promise;
        return { data, success: true };
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            return { error: e.message, success: false };
        }
        return { error: "Unknown error", success: false };
    }
}

export function safeSync<T>(func: () => T): Safe<T> {
    try {
        const data = func();
        return { data, success: true };
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            return { error: e.message, success: false };
        }
        return { error: "Unknown error", success: false };
    }
}
