'use strict';

class Duration {

    constructor(duration) {
        this.duration = duration;
    }

    static of(min, percentage) {
        if (percentage !== undefined) {
            let duration = Math.floor(percentage * 60) * 60;
            if (duration < min) {
                duration = min;
            }
            return new Duration(duration);
        }
        return new Duration(min);
    }

    value() {
        return this.duration
    }

    isOver() {
        return this.duration <= 0
    }

    decrement() {
        return new Duration(this.duration - 1, 0)
    }

    prettyPrint() {
        let minutes = parseInt(this.duration / 60, 10);
        let seconds = parseInt(this.duration % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    }
}

module.exports = Duration
