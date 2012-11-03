var spawn = require("child_process").spawn,
    es = require("event-stream"),
    _ = require("underscore")

var master = module.exports = (function(master) {
  master.run = function(numberOfWorkers) {
    var streams = _(numberOfWorkers || 6).chain()
      .range()
      .map(function() {
        return spawn("./bin/1kl.sh").stdout
      })
      .value()
    return es.merge.apply(es, streams)
  }
  return master
})({})

if (module.parent === null) {
  master.run().pipe(process.stdout)
}
