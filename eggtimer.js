'use strict';

let _timer = 0;
let _view;

var init = function (duration, view) {
    _timer = duration
    _view = view;

    _view(_timer)
}

var tick = (finish) => {
    _view(_timer);

    if(_timer <= 0) {
        finish();
        return;
    }
    _timer--;
};