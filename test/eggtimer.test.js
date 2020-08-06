'use strict'
const {describe, it, afterEach} = require("mocha")
const expect = require('chai').expect
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

    it('views initial timer', function() {
        let eggTimer = new EggTimer(viewSpy, finishSpy, 2)
        expect(output).to.eql([2])
    })

    it('updates view on tick', function() {
        let eggTimer = new EggTimer(viewSpy, finishSpy, 2)
        eggTimer.tick()
        expect(output).to.eql([2, 1])
        expect(finish).to.equal(false)
    })

    it('updates view on all ticks', function() {
        let eggTimer = new EggTimer(viewSpy, finishSpy, 2)
        eggTimer.tick()
        eggTimer.tick()
        expect(output).to.eql([2, 1, 0])
    })

    it('finishes timer', function() {
        let eggTimer = new EggTimer(viewSpy, finishSpy, 2)
        eggTimer.tick()
        eggTimer.tick()
        expect(finish).to.equal(true)
    })

    it('does not overcount', function() {
        let eggTimer = new EggTimer(viewSpy, finishSpy, 2)
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