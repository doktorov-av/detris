import type {Offset, Position} from "../tetris/GameProps.ts";

export const Utils = {
    normalizeAngle: (angle: number): number => {
        angle = (angle + 180) % 360;
        if (angle < 0) {
            angle += 360;
        }
        return angle - 180;
    },
    addRotation: (base: number, angle: number) => {
        return Utils.normalizeAngle(base + angle)
    },
    toRadians(angle: number) {
        return Math.PI * angle / 180;
    },
    rotate(pos: Position, angle: number): Position {
        return {
            x: pos.x * Math.cos(angle) - pos.y * Math.sin(angle),
            y: pos.x * Math.sin(angle) + pos.y * Math.cos(angle),
        }
    },
    offset(pos: Position | Offset, offset: Offset): Position {
        return {
            x: pos.x + offset.x,
            y: pos.y + offset.y,
        }
    }
}

