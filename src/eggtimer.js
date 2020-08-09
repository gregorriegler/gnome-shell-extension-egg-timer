'use strict'

// todo presenter told egg timer with init what the time is. egg timer does not need to call that info back
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
        this.clock = new this.Clock(() => {
            this.tick()
        })
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

    duration() {
        return this._duration
    }

    destroy() {
        this.stop()
    }
}

module.exports = EggTimer