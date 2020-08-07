'use strict';

class EggTimer {
    constructor(notifyTime, duration) {
        this.notifyTime = notifyTime;
        this.init(duration);
    }

    init(duration) {
        if(duration === undefined) return;
        this._duration = duration;
        this.notifyTime(this._duration)
    }

    tick(notifyFinish) {
        if (this._duration.zero()) {
            return;
        }
        this._duration = this._duration.decrement();
        this.notifyTime(this._duration);
        if (this._duration.zero()) {
            notifyFinish();
        }
    }

    duration() {
        return this._duration;
    }

    over() {
        return this._duration.zero()
    }
}

module.exports = EggTimer