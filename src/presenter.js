'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Duration = Me.imports.duration.Duration
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 60
const MAX_TIMER = 3600

class Presenter {

    constructor(indicator, eggTimer, sound) {
        this.indicator = indicator
            .setChangeDurationByPercentNotification(this.changeDurationByPercent.bind(this))
            .setToggleLoopNotification(this.toggleLoop.bind(this))
            .setPlayClickedNotification(this.play.bind(this))
            .setPauseClickedNotification(this.pause.bind(this))

        this.eggTimer = eggTimer
            .setTimeChangedNotification(this.durationChanged.bind(this))
            .setFinishNotification(this.finish.bind(this))

        this.sound = sound
        this.loop = false

        this.changeDuration(new Duration(MIN_TIMER))
    }

    toggleLoop(loop) {
        debug(`toggle loop ${loop}`)
        this.loop = loop
    }

    play() {
        info('play')
        this.indicator.showPauseButton()
        this.eggTimer.start()
    }

    finish() {
        info('finish')
        this.sound.play()
        this.changeDurationByPercent(this.indicator.timeSlider.value)
        if (this.loop) {
            this.play()
        }
    }

    changeDurationByPercent(percentage) {
        this.changeDuration(Duration.of(MIN_TIMER, MAX_TIMER, percentage))
    }

    changeDuration(duration) {
        debugTime('change duration', duration)
        this.durationChanged(duration)
        this.eggTimer.init(duration)
        this.pause()
    }

    durationChanged(duration) {
        this.indicator.displayDuration(duration)
    }

    pause() {
        this.eggTimer.stop()
        this.indicator.showPlayButton()
    }
}