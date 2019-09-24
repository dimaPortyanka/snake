class Score {
    value: number
    constructor() {
        this.value = 0
    }

    increase() {
        this.update(this.value+1)
    }

    update(newValue: number) {
        this.value = newValue

        this._render()
    }

    _render() {
        let scoreDom: HTMLElement | null = document.querySelector(".score")
        if (!scoreDom) {
            throw Error("can't render scores")
        }

        scoreDom.innerHTML = this.value.toString()
    }
}

export let scoreField = new Score()
