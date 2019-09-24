export class Stack<T> {
    values: T[]
    len: number

    constructor(
        arr: T[],
    ) {
        this.values = [...arr]
        this.len = arr.length
    }

    getLength(): number {
        return this.len
    }

    getValues(): T[] {
        return [...this.values]
    }

    increaseLength() {
        this.len++
    }

    add(element: T) {
        this.values.unshift(element)
        this.values.length = this.len
    }
}
