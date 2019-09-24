import { fromEvent, merge, Observable} from 'rxjs';
import {
    map,
    filter,
    mapTo,
} from 'rxjs/operators';

import { Directions } from './directions'

interface IKeyDirections {
    [key: string]: Directions
}

const keyDirection: IKeyDirections = {
    'ArrowDown': Directions.DOWN,
    'ArrowUp': Directions.UP,
    'ArrowRight': Directions.RIGHT,
    'ArrowLeft': Directions.LEFT,
    'd': Directions.RIGHT,
    'a': Directions.LEFT,
    'w': Directions.UP,
    's': Directions.DOWN,
}

const selectorDirection: IKeyDirections = {
    '.up.control': Directions.UP,
    '.down.control': Directions.DOWN,
    '.left.control': Directions.LEFT,
    '.right.control': Directions.RIGHT,
}

export function listenUserInput(): Observable<Directions> {
    const userInputFromButtons = Object.entries(selectorDirection)
    .map(([selector, direction]: [string, Directions]) => {
        const element = document.querySelector(selector)
        if (!element) {
            throw new Error(`Element with class ${selector} dosn't exists!`);
        }

        return (
            fromEvent(element, 'click').pipe(mapTo(direction))
        )
    })

    const userInput = merge(
        ...userInputFromButtons,
        fromEvent(document, 'keydown')
            .pipe(
                map((event: KeyboardEvent) => event.key),
                filter(key => !!keyDirection[key]),
                map(key => keyDirection[key])
            ),
    )

    return userInput
}
