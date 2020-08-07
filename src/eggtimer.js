'use strict';

class EggTimer {
    constructor(viewCallback, finishCallback, duration) {
        this.viewCallback = viewCallback;
        this.finishCallback = finishCallback;
        this.init(duration);
    }

    init(duration) {
        this._over = false;
        this.duration = duration;
        this.viewCallback(this.duration.value())
    }

    tick() {
        if (this.duration.isOver()) {
            if (!this._over) {
                this.finishCallback();
                this._over = true;
            }
        } else {
            this.duration = this.duration.decrement();
            this.viewCallback(this.duration.value());
        }
    }

    over() {
        return this._over;
    }
}

module.exports = EggTimer