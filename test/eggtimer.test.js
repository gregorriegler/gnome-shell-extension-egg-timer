'use strict'
const {describe, it, beforeEach, afterEach} = require("mocha")
const expect = require('chai').expect
const Duration = require('../src/duration')
const EggTimer = require('../src/eggtimer')

console.log(EggTimer)

describe('EggTimer', function() {
    let timesRegistered = [];
    const notifyTimeSpy = function(duration) {
        timesRegistered.push(duration.value())
    }

    let finishesRegistered = 0;
    const notifyFinishSpy = function() {
        finishesRegistered++;
    }

    let eggTimer;
    beforeEach(() => {
        eggTimer = new EggTimer(notifyTimeSpy, notifyFinishSpy, new Duration(2));
    });

    it('views initial timer', function() {
        expect(timesRegistered).to.eql([2])
    })

    it('updates view on tick', function() {
        eggTimer.tick()

        expect(timesRegistered).to.eql([2, 1])
        expect(finishesRegistered).to.eql([])
        expect(eggTimer.over()).to.equal(false)
    })

    it('updates view on all ticks', function() {
        eggTimer.tick()
        eggTimer.tick()

        expect(timesRegistered).to.eql([2, 1, 0])
    })

    it('finishes timer', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()

        expect(finishesRegistered).to.equal(1)
        expect(eggTimer.over()).to.equal(true)
    })

    it('only finishes once', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()

        expect(finishesRegistered).to.equal(1)
        expect(eggTimer.over()).to.equal(true)
    })

    it('does not overcount', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()

        expect(timesRegistered).to.eql([2, 1, 0])
        expect(eggTimer.over()).to.equal(true)
    })

    it('resets with init', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.init(new Duration(2))

        expect(eggTimer.over()).to.equal(false)
    })

    it('shows left duration', function() {
        eggTimer.tick()
        eggTimer.duration()

        expect(eggTimer.duration()).to.eql(new Duration(1))
    })

    afterEach(() => {
        timesRegistered = [];
        finishesRegistered = [];
    });
})