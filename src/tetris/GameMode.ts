export const Modes = {
    Standard: 0,
    Slow: 1,
    Fast: 2,
    Timed: 3,
} as const;

export type GameMode =  typeof Modes[keyof typeof Modes];
export type GameModeName = keyof typeof Modes;
