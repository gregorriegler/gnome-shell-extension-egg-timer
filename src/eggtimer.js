'use strict';

class EggTimer {
    constructor(view, finish, duration) {
        this._view = view;
        this._finish = finish;
        this.init(duration);
    }

    init(duration) {
        this._duration = duration;
        this._view(this._duration.value())
    }

    tick() {
        if(!this._duration.isOver()) {
            this._duration = this._duration.decrement();
            this._view(this._duration.value());
        }

        if (this._duration.isOver()) {
            this._finish();
            return
        }
    }
}

module.exports = EggTimer