'use strict';

var dir = require('node-dir'),
  fs = require('fs')

function Load (path) {
  if (!path) {
    throw new Error('a path must be provided')
  }

  try{
    fs.lstatSync(path).isDirectory()
    this.path = path
  } catch (error) {
    throw new Error ('directory does not exists')
  }

  this.result = []
}

Load.prototype.append = function(filename, content) {
  var reg = /^[A-Za-z-_0-9]*/

  var partial = {
    name: reg.exec(filename)[0],
    content: content
  }

  this.result.push(partial)
};

Load.prototype.read = function(callback) {
  var self = this
  dir.readFiles(self.path,
    {
      shortName: true
    },
    function(err, content, file, next) {
      if (err){
        return callback(err, null)
      }

      self.append(file, content)
      next();
    },
    function(err, files){
      if (err) {
        return callback(err, null)
      }

      callback(null, self.result)
    }
  )
};

module.exports = Load
