'use strict';

const Duration = require('../src/duration')

class EggTimer {
    constructor(view, finish, duration) {
        this._view = view;
        this._finish = finish;
        this.init(duration);
    }

    init(duration) {
        this._timer = duration.value()
        this._view(this._timer)
    }

    tick() {
        if(this._timer > 0) {
            this._view(--this._timer);
        }

        if (this._timer <= 0) {
            this._finish();
        }
    }
}

module.exports = EggTimer