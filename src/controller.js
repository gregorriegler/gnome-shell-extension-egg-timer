'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const EggTimer = Me.imports.eggtimer.EggTimer
const Duration = Me.imports.duration.Duration
const Sound = Me.imports.sound.Sound
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 60
const MAX_TIMER = 3600

class Controller {

    constructor(indicator, Clock) {
        this.indicator = indicator
        this.indicator.setChangeDurationByPercentHandler(this.changeDurationByPercent.bind(this))
        this.indicator.setToggleLoopHandler(this.toggleLoop.bind(this))
        this.indicator.setTogglePlayPauseHandler(this.togglePlayPause.bind(this))

        this.Clock = Clock

        this.eggTimer = new EggTimer()
        this.eggTimer.setTimeChangedNotification(this.displayDuration.bind(this))
        this.eggTimer.setFinishNotification(this.finish.bind(this))
        this.eggTimer.init(new Duration(MIN_TIMER))

        this.sound = new Sound()
        this.loop = false
    }

    togglePlayPause(play) {
        debug(`toggle play/pause ${play}`)

        if (play) {
            this.start()
        } else {
            this.pause()
        }
    }

    toggleLoop(loop) {
        debug(`toggle loop ${loop}`)
        this.loop = loop
    }

    start() {
        info('start')
        this.indicator.showPauseButton()
        this.clock = new this.Clock(() => {
            this.eggTimer.tick(this.finish.bind(this))
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
            this.start()
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