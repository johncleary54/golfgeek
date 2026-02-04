export function capitalizeFirstLetter(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export function extractErrors(
    formData:
        | {
              form?: Record<string, string[]>;
          }
        | null
        | undefined,
    key: string,
): string[] {
    if (!formData?.form) return [];
    const errors = formData.form[key];
    if (!errors) return [];
    if (key in formData.form) return errors;
    return [];
}

export function formatNumber(num: FormDataEntryValue | null): number | undefined {
    if (num === null) return undefined;
    if (typeof num !== "number" && typeof num !== "string") return undefined;

    let number = undefined;
    if (typeof num === "string") {
        number = Number(num.replace(",", "."));
    } else {
        number = Number(num);
    }

    return isNaN(number) ? undefined : number;
}

export function addPlusSign(num: number): string {
    return num > 0 ? `+${num}` : num.toString();
}

export function trapfocus(node: HTMLElement): { destroy(): void } {
    const previous = document.activeElement as HTMLElement;

    function focusable(): HTMLElement[] {
        return Array.from(
            node.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
        );
    }

    function handleKeydown(event: KeyboardEvent): void {
        if (event.key !== "Tab") return;

        const current = document.activeElement;

        const elements = focusable();
        const first = elements.at(0);
        const last = elements.at(-1);

        if (event.shiftKey && current === first) {
            last?.focus();
            event.preventDefault();
        }

        if (!event.shiftKey && current === last) {
            first?.focus();
            event.preventDefault();
        }
    }

    focusable()[0]?.focus();

    node.addEventListener("keydown", handleKeydown);

    return {
        destroy() {
            node.removeEventListener("keydown", handleKeydown);
            previous.focus({ preventScroll: true });
        },
    };
}

export function formatSingleWordOrCamelCase(name: string): string {
    const formattedName = name.replace(/([a-z])([A-Z])/g, "$1 $2");

    const words = formattedName.split(" ");
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

    return capitalizedWords.join(" ");
}

export function yardsToFeet(yards: number): number {
    return yards * 3;
}

export function feetToYards(feet: number): number {
    return feet / 3;
}

export function showRoundOrShotData(active: string, roundSG: number, shotSG: number): number {
    if (active === "round") {
        return roundSG;
    } else {
        return shotSG;
    }
}
