'use strict';

var should = require('should');
var PROJECT_NAME = require('../package.json').name;
var loader = require('..');
var staticJson5 = "{name: 'test'}";

describe(PROJECT_NAME, function () {
  it('should export the loader', function (done) {
    should(loader).be.type('function');
    done();
  });

  it('should export a default for es2015 support', function (done) {
    should.exist(loader.default);
    should(loader.default).be.type('function');
    done();
  });

  it('should convert to requires', function (done) {
    var content = loader.call({}, staticJson5);
    should(content).be.eql('module.exports = {\n\t"name": "test"\n}');
    done();
  });

  it('should fire cacheable', function (done) {
    var cacheable = function () {
      done();
    };
    var content = loader.call({cacheable: cacheable}, staticJson5);
    should(content).be.eql('module.exports = {\n\t"name": "test"\n}');
  });

  it('should catch invalid JSON5', function (done) {
    var brokenJson5 = '{broken: json5}';
    should(function () {
      loader.call({}, brokenJson5);
    }).throw('Error using JSON5 parsing');
    done();
  });
});
