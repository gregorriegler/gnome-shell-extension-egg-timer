'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const EggTimer = Me.imports.eggtimer.EggTimer
const Duration = Me.imports.duration.Duration
const Clock = Me.imports.clock.Clock
const Sound = Me.imports.sound.Sound
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 60
const MAX_TIMER = 3600

class Controller {

    constructor(indicator) {
        this.indicator = indicator
        this.eggTimer = new EggTimer(this.indicator.displayDuration.bind(this.indicator), new Duration(MIN_TIMER))
        this.sound = new Sound()
        this.loop = false

        indicator.setTogglePlayPauseHandler(this.togglePlayPause.bind(this))
        indicator.setChangeDurationByPercentHandler(this.changeDurationByPercent.bind(this))
        indicator.setToggleLoopHandler(this.toggleLoop.bind(this))
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
        this.loop = loop;
    }

    start() {
        info('start')
        this.indicator.showPauseButton()
        this.clock = new Clock(() => {
            this.eggTimer.tick(this.finish.bind(this))
        })
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
        this.stopTicking();
        this.indicator.showPlayButton()
    }

    destroy() {
        this.stopTicking();
    }

    stopTicking() {
        if (this.clock) {
            this.clock.stopTicking()
        }
    }
}