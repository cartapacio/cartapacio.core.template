'use strict';

var mocha = require('mocha'),
  expect = require('chai').expect,
  Load = require('../load')


describe('Load', function (){

  describe('constructor', function (){

    it('must throw error if not receive a path', function (){
      var bad = function (){
        return new Load()
      }
      expect(bad).to.Throw(Error)
    })

    it('should throw error if path does not exists', function (){
      var bad = function (){
        return new Load('./tpl')
      }

      expect(bad).to.Throw(Error)
    })

    it('should succeed if path exists', function (){
      var good = function (){
        return new Load('./templates')
      }

      expect(good).to.be.ok
    })
  })
})
