'use strict';

let timer = 0;

var init = function (duration, view) {
    timer = duration
    view(timer)
}

var tick = (view, finish) => {
    view(timer);

    if(timer <= 0) {
        finish();
        return;
    }
    timer--;
};