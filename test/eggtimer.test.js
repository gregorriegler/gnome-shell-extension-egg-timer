'use strict'
const expect = require('chai').expect
const Duration = require('../src/duration')
const EggTimer = require('../src/eggtimer')

let timesRegistered = []
const notifyTimeSpy = duration => {
    timesRegistered.push(duration.value())
}

let finishesRegistered = 0
const notifyFinishSpy = () => {
    finishesRegistered++
}

class ClockSpy {

    constructor(tick) {
        this.tick = tick
    }

    stopTicking() {
        this.stopTickingCalled = true
    }
}

let eggTimer
const createTimer = duration => {
    return new EggTimer(ClockSpy)
        .setTimeChangedNotification(notifyTimeSpy)
        .setFinishNotification(notifyFinishSpy)
        .init(new Duration(duration))
}

describe('EggTimer', () => {
    describe('notifies about the time', () => {
        beforeEach(() => {
            eggTimer = createTimer(2)
        })

        it('notifies about the time on a tick', () => {
            eggTimer.start()
            eggTimer.clock.tick()

            expect(timesRegistered).to.eql([1])
        })

        it('notifies about the time on each tick', () => {
            eggTimer.start()
            eggTimer.clock.tick()
            eggTimer.clock.tick()

            expect(timesRegistered).to.eql([1, 0])
        })

        it('does not overcount', () => {
            eggTimer.start()
            eggTimer.clock.tick()
            eggTimer.clock.tick()
            eggTimer.clock.tick()

            expect(timesRegistered).to.eql([1, 0])
        })

        it('restarts count with init', () => {
            eggTimer.start()
            eggTimer.clock.tick()
            eggTimer.clock.tick()
            eggTimer.clock.tick()
            eggTimer.init(new Duration(3))
            eggTimer.clock.tick()

            expect(timesRegistered).to.eql([1, 0, 2])
        })
    })

    describe('tells when its finished', () => {
        describe('starting at 2', () => {
            beforeEach(() => {
                eggTimer = createTimer(2)
            })

            it('starts unfinished', () => {
                expect(finishesRegistered).to.equal(0)
            })

            it('is not finished before 0', () => {
                eggTimer.start()
                eggTimer.clock.tick()

                expect(finishesRegistered).to.equal(0)
            })

            it('finishes', () => {
                eggTimer.start()
                eggTimer.clock.tick()
                eggTimer.clock.tick()
                eggTimer.clock.tick()

                expect(finishesRegistered).to.equal(1)
            })

            it('finishes only once', () => {
                eggTimer.start()
                eggTimer.clock.tick()
                eggTimer.clock.tick()
                eggTimer.clock.tick()
                eggTimer.clock.tick()
                eggTimer.clock.tick()

                expect(finishesRegistered).to.equal(1)
            })

            it('finishes a second time after init', () => {
                eggTimer.start()
                eggTimer.clock.tick()
                eggTimer.clock.tick()
                eggTimer.clock.tick()
                eggTimer.init(new Duration(1))
                eggTimer.clock.tick()

                expect(finishesRegistered).to.equal(2)
            })
        })

        it('does not bell when starting at 0', () => {
            eggTimer = createTimer(0)

            expect(finishesRegistered).to.equal(0)
        })
    })

    describe('stops the clock', () => {
        it('stops the clock after it was started', () => {
            eggTimer = createTimer(2)
            eggTimer.start()
            eggTimer.stop()

            expect(eggTimer.clock.stopTickingCalled).to.equal(true)
        })

        it('does not break when the clock wasnt started', () => {
            eggTimer = createTimer(2)
            eggTimer.stop()
        })

        it('stops the clock on destroy', () => {
            eggTimer = createTimer(2)
            eggTimer.start()
            eggTimer.destroy()

            expect(eggTimer.clock.stopTickingCalled).to.equal(true)
        })
    })

    afterEach(() => {
        timesRegistered = []
        finishesRegistered = 0
    })
})