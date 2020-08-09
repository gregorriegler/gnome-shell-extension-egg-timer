'use strict'

class EggTimer {
    setTimeChangedNotification(notifyTime) {
        this.notifyTime = notifyTime
    }

    setFinishNotification(notifyFinish) {
        this.notifyFinish = notifyFinish
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