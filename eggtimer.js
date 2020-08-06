'use strict';

class EggTimer {
    constructor(duration, view) {
        this._view = view;
        this.init(duration);
    }

    init(duration) {
        this._timer = duration
        this._view(this._timer)
    }

    tick(finish) {
        this._view(this._timer);

        if (this._timer <= 0) {
            finish();
            return;
        }
        this._timer--;
    }
}