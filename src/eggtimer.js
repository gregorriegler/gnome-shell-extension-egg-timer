'use strict';

class EggTimer {
    constructor(viewCallback, finishCallback, duration) {
        this.viewCallback = viewCallback;
        this.finishCallback = finishCallback;
        this.init(duration);
    }

    init(duration) {
        if(duration === undefined) return;
        this._over = false;
        this._duration = duration;
        this.viewCallback(this._duration)
    }

    tick() {
        if (this._duration.isOver()) {
            if (!this._over) {
                this.finishCallback();
                this._over = true;
            }
        } else {
            this._duration = this._duration.decrement();
            this.viewCallback(this._duration);
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