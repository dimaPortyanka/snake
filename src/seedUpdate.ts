import { Point } from './point'

export function seedUpdate(
    seed: Point,
    width: number,
    height: number,
    leftBorder: number,
    bottomBorder: number,
) {
    seed.x = Math.floor(Math.random() * width) + leftBorder
    seed.y = Math.floor(Math.random() * height) + bottomBorder
}
