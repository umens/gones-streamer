//
// This file is a wrapper to the exec call used in each of the verify scripts.
// It first checks what operating system is being used and if Windows it uses
// the Portable Git rather than the system Git.
//

var exec = require('child_process').exec
var path = require('path')
var os = require('os')

var winOBS = path.join(__dirname, '../assets/OBS-Studio/bin/64bit/obs64.exe');

module.exports = function spawnOBS (command, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = null
  }
  if (os.platform() === 'win32') {
    exec('"' + winOBS + '" ' + command, options, callback)
  } else {
    // exec('git  ' + command, options, callback)
  }
}
