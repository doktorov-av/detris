export const CellTuning = {
    shape: {
        width: 25,
        height: 25,
        widthPx: '25px',
        heightPx: '25px',
    },
    halfHeight: () => {
        return CellTuning.shape.height / 2;
    },
    halfWidth: () => {
        return CellTuning.shape.width / 2;
    }
} as const;