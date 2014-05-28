'use strict';

var handlebars = require('handlebars'),
  _ = require('lodash'),
  path = require('path'),
 // helpers = require('handlebars-helpers')(handlebars),
  chalk = require('chalk'),
  Load = require('./load')

var tplPath = null,
  layouts=[],
  partials = null

function Template (_path) {
  if (!_path) {
    throw new Error('a tplPath must be provided')
  }

  tplPath =  path.join(_path, 'src', 'templates')
}

Template.prototype.load = function(callback) {
  var self = this

  var tpl = new Load(tplPath, function (err, data){
    if(err){
      throw new Error(err)
      callback(err)
    }

    // register all the partials in dir
    _.each(data.partials, function (partial){
      self.registerPartial(partial.name, partial.content)
    })

    // compile all layouts
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
  // load the specified layout or the default
  var layout = _.find(layouts, {'name': data.layout}) || _.find(layouts, {'name': 'default'})
  if(!layout){
    throw new Error('layout not found')
  }

  // load as body the partial specified
  var body = handlebars.partials[data.page] || handlebars.partials['main']

  this.registerPartial('body', body)

  try {
    callback(null, layout.template({document: data.document, assets: data.assets}))
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
