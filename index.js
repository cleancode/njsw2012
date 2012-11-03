var spawn = require("child_process").spawn,
    es = require("event-stream"),
    _ = require("underscore")

var master = module.exports = (function(master) {
  master.run = function(numberOfWorkers) {
    return _(es.through()).tap(function(output) {
      _(numberOfWorkers || 6).times(function() {
        spawn("./bin/1kl.sh").stdout.pipe(output)
      })
    })
  }
  return master
})({})

if (module.parent === null) {
  master.run().pipe(process.stdout)
}
