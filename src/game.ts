import { listenUserInput } from './userInput'
import { Directions } from './directions'
import { Point } from './point'
import { init, render } from './render'
import { updateCoordinate } from './updateCoordinate'
import { seedUpdate } from './seedUpdate'
import { Stack } from './stack'
import { scoreField } from './score'

const BASE_FRAME_UPDATE_FREQUANCE = 200

function start():void {
    let speed = 1
    let timePerUpdate = BASE_FRAME_UPDATE_FREQUANCE / speed
    let curDirection = Directions.UP

    let snakeHeadCoordinate: Point = {
        x: 0,
        y: 0,
    }

    let tail = new Stack<Point>([{ x: 0, y: -1 }, { x: 0, y: -2 }])

    listenUserInput()
    .subscribe((newDirection) => {
        curDirection = newDirection
    })

    const {
        visibleHeight,
        visibleWidth,
    } = init()

    const topBorder = Math.floor(visibleHeight/2)-1
    const bottomBorder = -Math.floor(visibleHeight/2)+1
    const leftBorder = -Math.floor(visibleWidth/2)+1
    const rightBorder = Math.floor(visibleWidth/2)-1

    let seedCoordinate: Point = {
        x: 0,
        y: 0,
    }

    seedUpdate(seedCoordinate, visibleWidth, visibleHeight, leftBorder, bottomBorder)
    scoreField.update(0)

    const gameLoop = () => {
        tail.add({
            ...snakeHeadCoordinate,
        })
        updateCoordinate(snakeHeadCoordinate, curDirection)

        if (
            snakeHeadCoordinate.x > rightBorder ||
            snakeHeadCoordinate.x < leftBorder ||
            snakeHeadCoordinate.y > topBorder ||
            snakeHeadCoordinate.y < bottomBorder
        ) {
            alert('Out of borders!')

            return
        }

        const intersection = tail.getValues().find(({ x, y }) => {
            return snakeHeadCoordinate.x == x && snakeHeadCoordinate.y == y
        })

        if (intersection) {
            alert("You've eaten yourself!")

            return
        }

        if (
            seedCoordinate.x === snakeHeadCoordinate.x &&
            seedCoordinate.y === snakeHeadCoordinate.y
        ) {

            scoreField.increase()
            tail.increaseLength()
            seedUpdate(
                seedCoordinate,
                visibleWidth,
                visibleHeight,
                leftBorder,
                bottomBorder,
            )
        }

        setTimeout(gameLoop, timePerUpdate)
    }

    const renderer = () => {
        render(
            snakeHeadCoordinate,
            tail.getValues(),
            seedCoordinate,
        )

        requestAnimationFrame(renderer)
    }

    renderer()
    gameLoop()
}

start()
