'use strict';

var mocha = require('mocha'),
  expect = require('chai').expect,
  Template = require('../index')

describe('Template', function (){

  describe('constructor', function (){

    it('must throw error if not receive a path', function (){
      var bad = function (){
        return new Template()
      }
      expect(bad).to.Throw(Error)
    })

  })
})
