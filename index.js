var spawn = require("child_process").spawn,
    es = require("event-stream"),
    split = require("./lib/split-stream"),
    append = require("./lib/append-stream"),
    _ = require("underscore"),
    _ = require("./lib/underscore-invoke")(_)


var master = module.exports = (function(master) {
  master.run = function(numberOfWorkers) {
    return _(numberOfWorkers || 6).chain()
      .range()
      .map(function() {
        return spawn("./bin/1kl.sh").stdout.pipe(split()).pipe(append("\n"))
      })
      .invokeSplat(es.merge)
      .value()
  }
  return master
})({})

if (module.parent === null) {
  master.run().pipe(process.stdout)
}
