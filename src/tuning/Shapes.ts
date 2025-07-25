export const Shapes = {
    'FlatShape' : {
        mShape: [
            [1,1,1,1],
        ]
    },
    'TShape' : {
        mShape: [
            [1,1,1],
            [0,1,0]
        ]
    },
    'LShape' : {
        mShape: [
            [0,0,1],
            [1,1,1]
        ]
    },
    'LShapeInv' : {
        mShape: [
            [1,0,0],
            [1,1,1]
        ]
    },
    'Cube' : {
        mShape: [
            [1,1],
            [1,1]
        ]
    }
}

export type ShapeType = keyof typeof Shapes;