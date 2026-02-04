const className =
    "border flex flex-row items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-lg px-4 py-2.5 font-medium shadow-component transition focus:ring-1 disabled:opacity-50";

export const btn: {
    primary: string;
    secondary: string;
    ghost: string;
    error: string;
    sm: string;
    md: string;
    lg: string;
} = {
    primary:
        className +
        " bg-primary-600 text-white hover:bg-primary-700 focus:ring-secondary-300",
    secondary: className + " bg-white hover:bg-neutral-100 focus:ring-primary-300",
    ghost:
        className + " border border-transparent bg-transparent shadow-none focus:ring-primary-300",
    error: className + " bg-error-600 text-white hover:bg-error-700 focus:ring-error-300",
    sm: " text-sm",
    md: " text-base",
    lg: " text-lg",
};
