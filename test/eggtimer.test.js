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

    let finish = false;
    const finishSpy = function() {
        finish = true;
    }

    let eggTimer;
    beforeEach(() => {
        eggTimer = new EggTimer(viewSpy, finishSpy, new Duration(2, 0));
    });

    it('views initial timer', function() {
        expect(output).to.eql([2])
    })

    it('updates view on tick', function() {
        eggTimer.tick()
        expect(output).to.eql([2, 1])
        expect(finish).to.equal(false)
    })

    it('updates view on all ticks', function() {
        eggTimer.tick()
        eggTimer.tick()
        expect(output).to.eql([2, 1, 0])
    })

    it('finishes timer', function() {
        eggTimer.tick()
        eggTimer.tick()
        expect(finish).to.equal(true)
    })

    it('does not overcount', function() {
        eggTimer.tick()
        eggTimer.tick()
        eggTimer.tick()
        expect(output).to.eql([2, 1, 0])
    })

    afterEach(() => {
        output = [];
        finish = false;
    });
})