'use strict'
const expect = require('chai').expect
const Duration = require('../src/duration')
const EggTimer = require('../src/eggtimer')

let timesRegistered = [];
const notifyTimeSpy = duration => {
    timesRegistered.push(duration.value())
}

let finishesRegistered = 0;
const notifyFinishSpy = () => {
    finishesRegistered++;
}

let eggTimer;
const createTimer = duration => {
    return new EggTimer()
        .setTimeChangedNotification(notifyTimeSpy)
        .setFinishNotification(notifyFinishSpy)
        .init(new Duration(duration))
};

describe('EggTimer', () => {
    describe('notifies about the time', () => {
        describe('starting at 2', () => {
            beforeEach(() => {
                eggTimer = createTimer(2)
            });

            it('notifies about the time on a tick', () => {
                eggTimer.tick()

                expect(timesRegistered).to.eql([1])
            })

            it('notifies about the time on each tick', () => {
                eggTimer.tick()
                eggTimer.tick()

                expect(timesRegistered).to.eql([1, 0])
            })

            it('does not overcount', () => {
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()

                expect(timesRegistered).to.eql([1, 0])
            })

            it('restarts count with init', () => {
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.init(new Duration(3))
                eggTimer.tick()

                expect(timesRegistered).to.eql([1, 0, 2])
            })
        })
    })

    describe('tells when its finished', () => {
        describe('starting at 2', () => {
            beforeEach(() => {
                eggTimer = createTimer(2);
            });

            it('starts unfinished', () => {
                expect(finishesRegistered).to.equal(0)
            })

            it('is not finished before 0', () => {
                eggTimer.tick()

                expect(finishesRegistered).to.equal(0)
            })

            it('finishes', () => {
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()

                expect(finishesRegistered).to.equal(1)
            })

            it('finishes only once', () => {
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()

                expect(finishesRegistered).to.equal(1)
            })

            it('finishes a second time after init', () => {
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.init(new Duration(1))
                eggTimer.tick()

                expect(finishesRegistered).to.equal(2)
            })
        })

        it('does not bell when starting finished', () => {
            eggTimer = createTimer(0)

            expect(finishesRegistered).to.equal(0)
        })
    })

    it('shows left duration', () => {
        eggTimer = createTimer(2)

        eggTimer.tick()
        eggTimer.duration()

        expect(eggTimer.duration()).to.eql(new Duration(1))
    })

    afterEach(() => {
        timesRegistered = [];
        finishesRegistered = 0;
    });
})