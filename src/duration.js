'use strict'

class Duration {

    constructor(duration) {
        this.duration = duration
    }

    static of(min, max, percentage) {
        return new Duration((max - min) * percentage + min)
    }

    value() {
        return this.duration
    }

    zero() {
        return this.duration <= 0
    }

    decrement() {
        return new Duration(this.duration - 1, 0)
    }

    prettyPrint() {
        let minutes = parseInt(this.duration / 60, 10)
        let seconds = parseInt(this.duration % 60, 10)
        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds
        return minutes + ":" + seconds
    }
}

module.exports = Duration
