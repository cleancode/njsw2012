var sockjs = require("sockjs"),
    _ = require("underscore")

module.exports = (function(Shover) {

  Shover = function(options) {
    this.connections = {}
    this.server = sockjs.createServer({
      log: function(severity, line) {
        if (options.env === "development") {
          return console.log(line)
        }
        if (severity === "error") {
          return console.log(line)
        }
      }
    })

    bind(this.server, this)
  }

  Shover.prototype.broadcast = function(message) {
    _(this.connections).each(function(connection) {
      connection.write(JSON.stringify(message.event))
    })
  }

  Shover.prototype.attachTo = function(server) {
    this.server.installHandlers(server, {prefix:'/shover'})
  }

  function bind(server, shover) {
    server.on("connection", function(connection) {
      shover.connections[connection.id] = connection
      connection.on("data", function(message) {
        // ingore for now
      })
      connection.on("close", function() {
        delete shover.connections[connection.id]
      })
    })
  }

  return Shover
})()
