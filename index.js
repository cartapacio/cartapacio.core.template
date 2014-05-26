'use strict';

var handlebars = require('handlebars'),
  _ = require('lodash'),
  fs = require('fs'),
 // helpers = require('handlebars-helpers')(handlebars),
  chalk = require('chalk'),
  Load = require('./load')

var path = null,
  layouts=[],
  partials = null

function Template (_path) {
  if (!_path) {
    throw new Error('a path must be provided')
  }

  path = _path
}

Template.prototype.load = function(callback) {
  var self = this

  var tpl = new Load(path, function (err, data){
    if(err){
      throw new Error(err)
      callback(err)
    }

    _.each(data.partials, function (partial){
      self.registerPartial(partial.name, partial.content)
    })

    _.each(data.layouts, function (layout){
      self.compile(layout.content, function (err, tpl){
        var lyt = {
          name: layout.name,
          template: tpl
        }

        layouts.push(lyt)
      })
    })
    callback(null)
  })
};

Template.prototype.compile = function(template, callback) {
  var tpl

  try {
    tpl = handlebars.compile(template)
  } catch (ex){
    callback(ex, null)
  }

  callback(null, tpl)
}

Template.prototype.render = function(data, callback) {
  var layout = _.find(layouts, {'name': data.layout})

  this.registerPartial('body', handlebars.partials[data.page])

  try {
    callback(null, layout.template(data.content))
  } catch (ex){
    callback(ex, null)
  }
}

Template.prototype.registerPartial = function(name, content) {
  try {
    handlebars.registerPartial(name, content)
  } catch (ex){
    console.log( chalk.red(ex) )
  }

}

module.exports = Template
