'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Duration = Me.imports.duration.Duration
const Clock = Me.imports.clock.Clock
const Sound = Me.imports.sound.Sound
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 2
const MAX_TIMER = 3000

class Controller {

    constructor(eggTimer, indicator, clock) {
        eggTimer.init(new Duration(MIN_TIMER))
        this.eggTimer = eggTimer
        this.indicator = indicator
        this.clock = new Clock(() => {
            this.eggTimer.tick(this.finish.bind(this))
        })
        this.sound = new Sound()

    }

    togglePlayPause() {
        debug('toggle play/pause')

        if (this.clock.ticking()) {
            this.pause()
        } else {
            this.start()
        }
    }

    start() {
        info('start')
        this.indicator.showPauseButton()
        this.clock.startTicking()
    }

    finish() {
        info('finish')
        this.sound.play()
        this.changeDurationByPercent(this.indicator.timeSlider.value)
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
        this.clock.stopTicking()
        this.indicator.showPlayButton()
    }

    destroy() {
        this.clock.stopTicking()
        this.indicator.destroy()
    }
}