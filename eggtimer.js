'use strict';

const EggTimer = function (duration, view) {
    this._view = view;
    this._timer = duration;
    this._view(this._timer)

    this.init = (duration) => {
        this._timer = duration
        this._view(this._timer)
    }

    this.tick = (finish) => {
        this._view(this._timer);

        if (this._timer <= 0) {
            finish();
            return;
        }
        this._timer--;
    };
};