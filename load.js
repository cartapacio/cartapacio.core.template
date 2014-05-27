'use strict';

var dir = require('node-dir'),
  fs = require('fs'),
  files = {
    layouts:[],
    partials:[]
  }

function Load (path, callback) {
  if (!path) {
    throw new Error('a path must be provided')
  }

  try{
    fs.lstatSync(path).isDirectory()
    this.path = path
  } catch (error) {
    throw new Error ('directory does not exists')
  }

  this.read(function (err, data){
    callback(err, data)
  })
}

Load.prototype.append = function(filename, content) {
  // test for:  (layouts)/(default)(.hbs)
  var reg = /([\w]*)\/([\w-_]*)(\.hbs$)/
  var result = reg.exec(filename)

  if(result){
    var file = {
      name: result[2],
      content: content
    }

    if(result[1] === 'layouts'){
      files.layouts.push(file)
    } else {
      files.partials.push(file)
    }

  } else {
    throw new Error('regex failed')
  }
};

/*
  return loaded files
*/
Load.prototype.getFiles = function() {
  return files
};

/*
  read all files in this.path
*/
Load.prototype.read = function(callback) {
  var self = this

  dir.readFiles(self.path,
    function(err, content, file, next) {
      if (err){
        return callback(err)
      }
      self.append(file, content)
      next(null);
    },
    function(err){
      if (err) {
        return callback(err, null)
      }

      // return the loaded files
      callback(null, self.getFiles())
    }
  )
};

module.exports = Load
