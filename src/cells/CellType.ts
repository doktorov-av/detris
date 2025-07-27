export const Cells = {
    white: 0,
    blue: 1,
    red: 2,
} as const;

export type CellType =  typeof Cells[keyof typeof Cells];
