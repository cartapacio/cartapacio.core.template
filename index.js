'use strict';

var handlebars = require('handlebars'),
  slug = require('slug'),
  _ = require('lodash'),
  path = require('path'),
  chalk = require('chalk'),
  Load = require('./load')

var tplPath = null,
  layouts=[],
  partials = null

// register helpers
require('handlebars-helpers').register(handlebars, {})
require('handlebars-layouts')(handlebars)

function Template (_path) {
  if (!_path) {
    throw new Error('a tplPath must be provided')
  }

  tplPath =  path.join(_path, 'src', 'templates')

  // register custom handlebars helpers

  // trim and return an slugified version of the given text
  handlebars.registerHelper('slugify', function (text){
    if (text === null){
      return ''
    }
    return slug(String(text).trim())
  })

  // clean html markup
  // stolen from underscore.string
  handlebars.registerHelper('plainify', function (text){
    if (text === null){
      return ''
    }
    return String(text).replace(/<\/?[^>]+>/g, '');
  })

  // remove some hidden chars
  handlebars.registerHelper('cleanify', function (text){
    if (text === null){
      return ''
    }
    return String(text).replace(/(\r\n|\n|\r|\t)/gm,'');
  })

  // chain helper
  // https://github.com/wycats/handlebars.js/issues/304#issuecomment-15635762
  handlebars.registerHelper('chain', function() {
    var helpers = [];
    var args = Array.prototype.slice.call(arguments);
    var argsLength = args.length;
    var index;
    var arg;

    for (index = 0, arg = args[index];
         index < argsLength;
         arg = args[++index]) {
      if (handlebars.helpers[arg]) {
        helpers.push(handlebars.helpers[arg]);
      } else {
        args = args.slice(index);
        break;
      }
    }

    while (helpers.length) {
      args = [helpers.pop().apply(handlebars.helpers, args)];
    }

    return args.shift();
  });
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
