'use strict'

const {describe, it} = require("mocha")
const expect = require('chai').expect
const Duration = require("../src/duration")

describe('Duration', function() {
    it('pretty prints', function() {
        expect(new Duration(2).prettyPrint()).to.equal('00:02')
        expect(new Duration(13).prettyPrint()).to.equal('00:13')
        expect(new Duration(99).prettyPrint()).to.equal('01:39')
    })

    it('respects min', function() {
        expect(Duration.of(60, 90, 0).value()).to.equal(60)
    })

    it('takes percentages', function() {
        expect(Duration.of(0, 60,.5).value()).to.equal(30)
    })

    it('decrements', function() {
        expect(new Duration(2).decrement()).to.eql(new Duration(1))
    })

    it('is not zero before 0', function() {
        expect(new Duration(2).zero()).to.equal(false)
    })

    it('is zero on 0', function() {
        expect(new Duration(0).zero()).to.equal(true)
    })
})