'use strict'

class EggTimer {
    constructor(notifyTime, notifyFinish, duration) {
        this.notifyTime = notifyTime
        this.notifyFinish = notifyFinish
        this.init(duration)
    }

    init(duration) {
        if(duration === undefined) return
        this._duration = duration
        this.notifyTime(this._duration)
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

    duration() {
        return this._duration
    }
}

module.exports = EggTimer