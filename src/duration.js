'use strict';

class Duration {

    constructor(min, percentage) {
        if (percentage !== undefined) {
            this.duration = Math.floor(percentage * 60) * 60;
            if (this.duration < min) {
                this.duration = min;
            }
            return;
        }
        this.duration = min;
    }

    value() {
        return this.duration
    }

    decrement() {
        return new Duration(this.duration-1, 0)
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
