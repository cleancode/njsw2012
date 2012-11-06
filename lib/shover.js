var sockjs = require("sockjs"),
    _ = require("underscore")

module.exports = (function(Shover) {

  Shover = function(options) {
    this.connections = {}
    this.userToConnection = {}
    this.connectionToUser = {}
    this.channels = {}
    this.subscriptions = {}
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
      connection.send(message.event)
    })
  }

  Shover.prototype.identify = function(connection, asUserWithId) {
    connection.send({result: "ok"})
    this.userToConnection[asUserWithId] = connection.id
    this.connectionToUser[connection.id] = asUserWithId
  }

  Shover.prototype.connection = function(someKindOfId) {
    if (this.connections[someKindOfId]) {
      return this.connections[someKindOfId]
    }
    if (this.userToConnection[someKindOfId]) {
      return this.connections[this.userToConnection[someKindOfId]]
    }
    return null
  }

  Shover.prototype.channel = function(name) {
    if (!this.channels[name]) {
      this.channels[name] = {
        name: name,
        connections: {},
        send: function(message) {
          _(this.connections).each(function(connection) {
            connection.send(message.event)
          })
        }
      }
    }
    return this.channels[name]
  }

  Shover.prototype.subscribe = function(connection, toChannel) {
    this.channel(toChannel).connections[connection.id] = connection
    this.subscriptions[connection.id] = toChannel
    connection.send({result: "ok"})
  }

  Shover.prototype.unsubscribe = function(connection, fromChannel) {
    if (this.channels[fromChannel]) {
      delete this.channels[fromChannel].connections[connection.id]
    }
    connection.send({result: "ok"})
  }

  Shover.prototype.attachTo = function(server) {
    this.server.installHandlers(server, {prefix:'/shover'})
  }

  function bind(server, shover) {
    server.on("connection", function(connection) {
      shover.connections[connection.id] = connection
      connection.send = function(message) {
        this.write(JSON.stringify(message))
      }
      connection.on("data", function(message) {
        unpack(message, connection, shover)
      })
      connection.on("close", function() {
        var userId = shover.connectionToUser[connection.id];
        delete shover.userToConnection[userId];
        delete shover.connectionToUser[connection.id];
        delete shover.connections[connection.id];
        _(shover.subscriptions[connection.id]).each(function(name) {
          shover.unsubscribe(connection, name)
        })
      })
    })
  }

  function unpack(message, connection, shover) {
    try {
      if (message.command) {
        switch (message.command) {
          case "identify":
            if (message.user) {
              return shover.identify(connection, message.user)
            }
            break
          case "subscribe":
            if (message.channel) {
              return shover.subscribe(connection, message.channel)
            }
            break
          case "unsubscribe":
            if (message.channel) {
              return shover.unsubscribe(connection, message.channel)
            }
            break
        }
      }
      // ignore, not a valid message
    } catch(e) {
      // ignore, not a valid message
    }
  }

  return Shover
})()
