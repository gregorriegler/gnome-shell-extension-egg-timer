'use strict'

const {describe, it} = require("mocha")
const expect = require('chai').expect
const Duration = require("../src/duration")

describe('Duration', function() {
    it('pretty prints', function() {
        expect(new Duration(2).prettyPrint()).to.equal('00:02')
    })

    it('respects min', function() {
        expect(Duration.of(60, 0).prettyPrint()).to.equal('01:00')
    })

    it('takes percentages', function() {
        expect(Duration.of(60, .5).prettyPrint()).to.equal('30:00')
    })

    it('returns the value', function() {
        expect(new Duration(60).value()).to.equal(60)
    })

    it('decrements', function() {
        expect(new Duration(2).decrement()).to.eql(new Duration(1))
    })
})