'use strict'

const {describe, it, beforeEach} = require("mocha")
const expect = require('chai').expect
const EggTimer = require("../src/eggtimer")

describe('EggTimer', function() {

    let output = [];
    const viewSpy = function(timer) {
        output.push(timer)
    }

    let finish = false;
    const finishSpy = function() {
        finish = true;
    }

    beforeEach(() => {
        let output = [];
        let finish = false;
    });

    it('views initial timer', function() {
        let eggTimer = new EggTimer(viewSpy, finishSpy, 1)
        expect(output).contains(1)
    })
})