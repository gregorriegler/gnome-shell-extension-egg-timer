'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Duration = Me.imports.duration.Duration
const {debug, debugTime, info} = Me.imports.log
const MIN_TIMER = 60
const MAX_TIMER = 3600

class Presenter {

    constructor(indicator, eggTimer, sound) {
        this.indicator = indicator
        this.indicator.setChangeDurationByPercentNotification(this.changeDurationByPercent.bind(this))
        this.indicator.setToggleLoopNotification(this.toggleLoop.bind(this))
        this.indicator.setPlayClickedNotification(this.play.bind(this))
        this.indicator.setPauseClickedNotification(this.pause.bind(this))

        this.eggTimer = eggTimer
        this.eggTimer.setTimeChangedNotification(this.durationChanged.bind(this))
        this.eggTimer.setFinishNotification(this.finish.bind(this))

        this.changeDuration(new Duration(MIN_TIMER))

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
        this.eggTimer.start()
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