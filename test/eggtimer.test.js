'use strict'
const {describe, it, beforeEach, afterEach} = require("mocha")
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
    return new EggTimer(notifyTimeSpy, notifyFinishSpy, new Duration(duration));
};

describe('EggTimer', () => {
    describe('notifies about the time', () => {
        describe('starting at 2', () => {
            beforeEach(() => {
                eggTimer = createTimer(2);
            });

            it('notifies about initial time', () => {
                expect(timesRegistered).to.eql([2])
            })

            it('notifies about the time on a tick', () => {
                eggTimer.tick()

                expect(timesRegistered).to.eql([2, 1])
            })

            it('notifies about the time on each tick', () => {
                eggTimer.tick()
                eggTimer.tick()

                expect(timesRegistered).to.eql([2, 1, 0])
            })

            it('does not overcount', () => {
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()

                expect(timesRegistered).to.eql([2, 1, 0])
            })

            it('restarts count with init', () => {
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.tick()
                eggTimer.init(new Duration(1))
                eggTimer.tick()

                expect(timesRegistered).to.eql([2, 1, 0, 1, 0])
            })
        })

        it('starting at 0', () => {
            eggTimer = createTimer(0);

            expect(timesRegistered).to.eql([0])
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

    describe('answers whether its over', () => {
        beforeEach(() => {
            eggTimer = createTimer(2);
        });

        it('starts not over', () => {
            expect(eggTimer.over()).to.equal(false)
        })

        it('is not over before 0', () => {
            eggTimer.tick()

            expect(eggTimer.over()).to.equal(false)
        })

        it('is over on 0', () => {
            eggTimer.tick()
            eggTimer.tick()
            eggTimer.tick()

            expect(eggTimer.over()).to.equal(true)
        })

        it('stays over beyond 0', () => {
            eggTimer.tick()
            eggTimer.tick()
            eggTimer.tick()
            eggTimer.tick()

            expect(eggTimer.over()).to.equal(true)
        })

        it('starts over', () => {
            eggTimer = createTimer(0)

            expect(eggTimer.over()).to.equal(true)
        })

        it('not over after reinitialization', () => {
            eggTimer.tick()
            eggTimer.tick()
            eggTimer.tick()
            eggTimer.init(new Duration(2))

            expect(eggTimer.over()).to.equal(false)
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