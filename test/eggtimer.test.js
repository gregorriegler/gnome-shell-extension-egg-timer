'use strict'
const {describe, it, beforeEach, afterEach} = require("mocha")
const expect = require('chai').expect
const Duration = require('../src/duration')
const EggTimer = require("../src/eggtimer")

console.log(EggTimer)

describe('EggTimer', function() {
    let output = [];
    const viewSpy = function(timer) {
        output.push(timer)
    }

    let finish = [];
    const finishSpy = function() {
        finish.push(true);
    }

    let eggTimer;
    beforeEach(() => {
        eggTimer = new EggTimer(viewSpy, finishSpy, new Duration(2));
    });

    it('views initial timer', function() {
        expect(output).to.eql([2])
    })

    it('updates view on tick', function() {
        eggTimer.tick()

        expect(output).to.eql([2, 1])
        expect(finish).to.eql([])
        expect(eggTimer.over()).to.equal(false)
    })

    it('updates view on all ticks', function() {
        eggTimer.tick()
        eggTimer.tick()

        expect(output).to.eql([2, 1, 0])
    })

    it('finishes timer', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()

        expect(finish).to.eql([true])
        expect(eggTimer.over()).to.equal(true)
    })

    it('only finishes once', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()

        expect(finish).to.eql([true])
        expect(eggTimer.over()).to.equal(true)
    })

    it('does not overcount', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()

        expect(output).to.eql([2, 1, 0])
        expect(eggTimer.over()).to.equal(true)
    })

    it('resets with init', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.init(new Duration(2))

        expect(eggTimer.over()).to.equal(false)
    })

    afterEach(() => {
        output = [];
        finish = [];
    });
})