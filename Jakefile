var fs = require("fs"),
    path = require("path"),
    async = require("async"),
    exec = require("child_process").exec,
    glob = require("glob"),
    util = require("util"),
    _ = require("underscore")

var PROJECT = _({}).tap(function(PROJECT) {
  PROJECT.root_directory = path.normalize(__dirname)
  PROJECT.work_directory = path.join(PROJECT.root_directory, ".work")
  PROJECT.logs_directory = path.join(PROJECT.work_directory, "logs")
})

task("default", ["test"])

desc("run all tests")
task("test", ["prepare"], {async: true}, function() {
  exec("mocha -c --recursive test/", function(error, stdout, stderr) {
    process.stdout.write(stdout)
    if (stderr.length > 0) console.error(stderr)
    if (error !== null) fail(error)
  })
})

desc("remove all created files")
task("clean", {async: true}, function() {
  fs.rmrfdir = require("rimraf")
  fs.rmrfdir(PROJECT.work_directory, complete)
})

desc("prepare work environment")
task("prepare", ["check", "lint"], {async: true}, function() {
  fs.mkdirp = require("mkdirp")
  async.series([
    function(next) {fs.mkdirp(PROJECT.work_directory, next)},
    function(next) {fs.mkdirp(PROJECT.logs_directory, next)}
  ], 
  function(error) {
    if (error) fail(error)
    complete()
  })
}, true)

desc("check external and global dependencies")
task("check", function() {
  jake.exec(["which jshint", "which mocha"], {async: true}, complete)
})

desc("lint all files")
task("lint", {async: true}, function() {
  async.parallel(
    [
      function(next) {glob("test/**/*.js", next)},
      function(next) {glob("lib/**/*.js", next)},
      function(next) {glob("*.js", next)}
    ],
    function(error, results) {
      if (error) fail(error)
      jake.exec([util.format("jshint %s", _(results).flatten().join(' '))], complete, {stdout: true})
    }
  )
})
