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

   it('should succeed if path exists', function (){
      var good = function (){
        return new Template('./templates')
      }

      expect(good).to.be.ok
    })

   it('must have a method to load files', function (){
      expect(Template).itself.to.respondTo('loadFiles')
   })

   it('should load files and store them in a local prototype', function (){
      var tpl = new Template('./templates')

      // expect(tpl).to.ownProperty('path')
      // expect(tpl.path).to.be.instanceof(Array)
      // expect(tpl.path).to.not.be.empty
   })

  })
})
