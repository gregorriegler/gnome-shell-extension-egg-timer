'use strict';

const Mainloop = imports.mainloop;

class Clock {

    constructor(eggTimer) {
        this.eggTimer = eggTimer
    }

    startTicking() {
        this.timeout = Mainloop.timeout_add_seconds(1, () => {
            this.tick()
        });
    }

    tick() {
        this.eggTimer.tick()
        if (this.ticking()) {
            this.startTicking();
        }
    }

    stopTicking() {
        if (this.ticking()) {
            Mainloop.source_remove(this.timeout);
            this.timeout = undefined;
        }
    }

    ticking() {
        return this.timeout !== undefined
    }
}

module.exports = Clock