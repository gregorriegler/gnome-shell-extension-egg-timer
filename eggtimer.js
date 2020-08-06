'use strict';

const EggTimer = function (){
    let _timer = 0;
    let _view;

    this.init = function (duration, view) {
        _timer = duration
        _view = view;

        _view(_timer)
    }

    this.tick = (finish) => {
        _view(_timer);

        if (_timer <= 0) {
            finish();
            return;
        }
        _timer--;
    };
};