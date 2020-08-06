'use strict';
const Duration = require("../src/duration");
const {describe, it} = require("mocha");
const expect = require('chai').expect;

describe('Duration', function() {
    it('pretty prints', function() {
        expect(new Duration(2, 0).prettyPrint()).to.equal('00:02')
    })

    it('respects min', function() {
        expect(new Duration(60, 0).prettyPrint()).to.equal('01:00')
    })

    it('takes percentages', function() {
        expect(new Duration(60, .5).prettyPrint()).to.equal('30:00')
    })

    it('returns the value', function() {
        expect(new Duration(60, 0).value()).to.equal(60)
    })
});
//
// import Duration from "src/duration";
//
// let duration = new Duration(0);
// console.log(duration);