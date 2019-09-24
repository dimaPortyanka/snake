import { Directions } from './directions'
import { Point } from './point'

export function updateCoordinate(pos: Point, direction: Directions) {
    switch (direction) {
        case Directions.UP:
            pos.y++
            break
        case Directions.DOWN:
            pos.y--
            break
        case Directions.LEFT:
            pos.x--
            break
        case Directions.RIGHT:
            pos.x++
            break
    }
}
