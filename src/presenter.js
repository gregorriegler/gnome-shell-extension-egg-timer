'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Duration = Me.imports.duration.Duration
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 60
const MAX_TIMER = 3600

class Presenter {

    constructor(indicator, eggTimer, Clock, sound) {
        this.indicator = indicator
        this.indicator.setChangeDurationByPercentNotification(this.changeDurationByPercent.bind(this))
        this.indicator.setToggleLoopNotification(this.toggleLoop.bind(this))
        this.indicator.setPlayClickedNotification(this.play.bind(this))
        this.indicator.setPauseClickedNotification(this.pause.bind(this))

        this.eggTimer = eggTimer
        this.eggTimer.setTimeChangedNotification(this.displayDuration.bind(this))
        this.eggTimer.setFinishNotification(this.finish.bind(this))
        this.eggTimer.init(new Duration(MIN_TIMER))

        this.Clock = Clock
        this.sound = sound
        this.loop = false
    }

    toggleLoop(loop) {
        debug(`toggle loop ${loop}`)
        this.loop = loop
    }

    play() {
        info('play')
        this.indicator.showPauseButton()
        this.startTicking()
    }

    startTicking() {
        this.clock = new this.Clock(() => {
            this.eggTimer.tick()
        })
    }

    displayDuration(duration) {
        this.indicator.displayDuration(duration)
    }

    finish() {
        info('finish')
        this.sound.play()
        this.changeDurationByPercent(this.indicator.timeSlider.value)
        if(this.loop) {
            this.play()
        }
    }

    changeDurationByPercent(percentage) {
        this.changeDuration(Duration.of(MIN_TIMER, MAX_TIMER, percentage))
    }

    changeDuration(duration) {
        debugTime('change duration', duration)
        this.eggTimer.init(duration)
        this.pause()
    }

    pause() {
        this.stopTicking()
        this.indicator.showPlayButton()
    }

    destroy() {
        this.stopTicking()
    }

    stopTicking() {
        if (this.clock) {
            this.clock.stopTicking()
        }
    }
}