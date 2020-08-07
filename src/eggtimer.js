'use strict';

class EggTimer {
    constructor(notifyTime, notifyFinish, duration) {
        this.notifyTime = notifyTime;
        this.notifyFinish = notifyFinish;
        this.init(duration);
    }

    init(duration) {
        if(duration === undefined) return;
        this._over = false;
        this._duration = duration;
        this.notifyTime(this._duration)
    }

    tick() {
        if (this._duration.isOver()) {
            if (!this._over) {
                this.notifyFinish();
                this._over = true;
            }
        } else {
            this._over = false;
            this._duration = this._duration.decrement();
            this.notifyTime(this._duration);
        }
    }

    duration() {
        return this._duration;
    }

    over() {
        return this._over;
    }
}

module.exports = EggTimer