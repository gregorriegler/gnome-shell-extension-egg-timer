'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Duration = Me.imports.duration.Duration
const Clock = Me.imports.clock.Clock
const Sound = Me.imports.sound.Sound
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 60
const MAX_TIMER = 3600

class Controller {

    constructor(eggTimer, indicator) {
        eggTimer.init(new Duration(MIN_TIMER))
        this.eggTimer = eggTimer
        this.indicator = indicator
        this.sound = new Sound()
        this.loop = false;

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