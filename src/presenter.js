'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Duration = Me.imports.duration.Duration
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 60
const MAX_TIMER = 3600

class Presenter {

    constructor(indicator, eggTimer, sound) {
        this.indicator = indicator
            .setSliderMovedNotification(this.sliderMoved.bind(this))
            .setToggleLoopNotification(this.toggleLoop.bind(this))
            .setPlayClickedNotification(this.play.bind(this))
            .setPauseClickedNotification(this.pause.bind(this))
            .setToggleMenuNotification(this.toggleMenu.bind(this))

        this.eggTimer = eggTimer
            .setTimeChangedNotification(this.durationChanged.bind(this))
            .setFinishNotification(this.finish.bind(this))

        this.sound = sound
        this.loop = false

        this.changeDuration(new Duration(MIN_TIMER))
    }

    toggleMenu(open) {
        info(`toggle menu ${open}`)
        if (open || this.slidersDuration().value() !== this.eggTimer._duration.value()) {
            this.indicator.showTimeDisplay()
        } else {
            this.indicator.hideTimeDisplay()
        }
    }

    sliderMoved() {
        this.changeDuration(this.slidersDuration())
    }

    toggleLoop(loop) {
        debug(`toggle loop ${loop}`)
        this.loop = loop
    }

    play() {
        info('play')
        this.indicator.showPauseButton()
        this.indicator.showTimeDisplay()
        this.eggTimer.start()
    }

    finish() {
        info('finish')
        this.sound.play()
        this.changeDuration(this.slidersDuration())
        if (this.loop) {
            this.play()
        } else {
            this.indicator.hideTimeDisplay()
        }
    }

    slidersDuration() {
        return Duration.of(MIN_TIMER, MAX_TIMER, this.indicator.timeSlider.value)
    }

    changeDuration(duration) {
        debugTime('change duration', duration)
        this.indicator.displayDuration(duration)
        this.eggTimer.init(duration)
        this.pause()
    }

    durationChanged(duration) {
        this.indicator.displayDuration(duration)
        this.indicator.showTimeDisplay()
    }

    pause() {
        this.eggTimer.stop()
        this.indicator.showPlayButton()
    }
}