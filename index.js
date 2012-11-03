var spawn = require("child_process").spawn,
    es = require("event-stream"),
    split = require("./lib/split-stream"),
    _ = require("underscore")

var master = module.exports = (function(master) {
  master.run = function(numberOfWorkers) {
    var streams = _(numberOfWorkers || 6).chain()
      .range()
      .map(function() {
        return spawn("./bin/1kl.sh").stdout.pipe(split())
      })
      .value()
    return es.merge.apply(es, streams)
  }
  return master
})({})

if (module.parent === null) {
  master.run().pipe(process.stdout)
}
