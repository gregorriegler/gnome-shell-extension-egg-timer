'use strict';

const EggTimer = function () {
    this._timer = 0;
    this._view;

    this.init = (duration, view) => {
        this._timer = duration
        this._view = view;

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