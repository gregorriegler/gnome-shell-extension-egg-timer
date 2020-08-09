'use strict'

class EggTimer {

    constructor(Clock) {
        this.Clock = Clock
    }

    setTimeChangedNotification(notifyTime) {
        this.notifyTime = notifyTime
        return this
    }

    setFinishNotification(notifyFinish) {
        this.notifyFinish = notifyFinish
        return this
    }

    init(duration) {
        if(duration === undefined) return
        this._duration = duration
        return this
    }

    start() {
        this.clock = new this.Clock(this.tick.bind(this))
    }

    tick() {
        if (this._duration.zero()) {
            return
        }
        this._duration = this._duration.decrement()
        this.notifyTime(this._duration)
        if (this._duration.zero()) {
            this.notifyFinish()
        }
    }

    stop() {
        if (this.clock) {
            this.clock.stopTicking()
        }
    }

    destroy() {
        this.stop()
    }
}

module.exports = EggTimer