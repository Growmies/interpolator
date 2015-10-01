var assert       = require('chai').assert,
    mocha        = require('mocha'),
    moment       = require('moment'),
    _            = require('lodash'),
    interpolator = require('../');

describe('Basic usage', function () {

  it("should parse {{date('YYYY-MM-DD')}}", function () {

    var obj = {
      a: 'test',
      b: 'test',
      c: "{{date('YYYY-MM-DD')}}",
      d: "{{date('-1days', 'YYYY-MM-DD')}}",
      e: "{{date('YYYY-MM-DD')}}",
      f: "{{date('-30days', 'YYYY-MM-DD')}}"
    };

    var testObj = {
      a: 'test',
      b: 'test',
      c: moment().format('YYYY-MM-DD'),
      d: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      e: moment().format('YYYY-MM-DD'),
      f: moment().subtract(30, 'days').format('YYYY-MM-DD')
    };

    var newObj = interpolator.interpolateSpecialValues(obj);

    assert(_.isEqual(newObj, testObj));

  });

  it("should parse {{date('-/+10{interval}', 'YYYY-MM-DD HH:MM:SS')}}", function () {

    //'seconds' could make the test fail

    _.each(['minutes', 'hours', 'days', 'weeks', 'months', 'years'], function (interval) {
      _.each(['-', '+'], function (direction) {

        var obj = {
          a: 'test',
          b: 'test',
          c: "{{date('" + direction + "1" + interval + "', 'YYYY-MM-DD HH:MM')}}"
        };

        var testObj = {
          a: 'test',
          b: 'test',
          c: moment()[(direction == '-' ? 'subtract' : 'add')](1, interval).format('YYYY-MM-DD HH:MM')
        };

        var newObj = interpolator.interpolateSpecialValues(obj);

        assert(_.isEqual(newObj, testObj));

      });
    });


  });

  it("should parse {{date('YYYY-MM-DD')}}", function () {
    var obj     = "Hello world, {)_0 {{date('-30days', 'YYYY-MM-DD')}} +-=}";
    var testObj = "Hello world, {)_0 " + moment().subtract(30, 'days').format('YYYY-MM-DD') + " +-=}";
    var newObj  = interpolator.interpolateSpecialValues(obj);
    assert(_.isEqual(newObj, testObj));
  });

  it("should parse {{date('start of year', 'YYYY-MM-DD')}}", function () {
    var obj     = "{{date('start of year', 'YYYY-MM-DD')}}";
    var testObj = moment().startOf('year').format('YYYY-MM-DD');
    var newObj  = interpolator.interpolateSpecialValues(obj);
    assert(_.isEqual(newObj, testObj));
  });

  it("should parse {{date('start of week', 'YYYY-MM-DD')}}", function () {
    var obj     = "{{date('start of week', 'YYYY-MM-DD')}}";
    var testObj = moment().startOf('week').format('YYYY-MM-DD');
    var newObj  = interpolator.interpolateSpecialValues(obj);
    assert(_.isEqual(newObj, testObj));
  });

  it("should parse {{date('start of month', 'YYYY-MM-DD')}}", function () {
    var obj     = "{{date('start of month', 'YYYY-MM-DD')}}";
    var testObj = moment().startOf('month').format('YYYY-MM-DD');
    var newObj  = interpolator.interpolateSpecialValues(obj);
    assert(_.isEqual(newObj, testObj));
  });

});