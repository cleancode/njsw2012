var connect = require("connect"),
    router = require("urlrouter"),
    configure = require("./lib/configure"),
    logger = require("./lib/logger"),
    _ = require("underscore"),
    sockjs = require("sockjs")



exports.start = function(callback) {
  configure("./etc/conf.yml", function(conf) {

    var shover = sockjs.createServer({
      log: function(severity, line) {
        if (conf.env === "development") {
          return console.log(line)
        }
        if (severity === "error") {
          return console.log(line)
        }
      }
    })

    shover.connections = {}
    shover.on("connection", function(connection) {
      shover.connections[connection.id] = connection
      connection.on("data", function(message) {
        // ingore for now
      })
      connection.on("close", function() {
        delete shover.connections[connection.id]
      })
    })

    var app = connect()
      .use(logger(conf))
      .use(connect.favicon())
      .use(connect.cookieParser())
      .use(connect.bodyParser())
      .use(router(function(app) {
        app.get("/ping", function(req, res) {
          res.setHeader("Content-Type", "text/plain")
          res.write("pong")
          res.end()
        })

        app.post("/events", function(req, res) {
          res.writeHead(202)
          res.end()
          _(shover.connections).each(function(connection) {
            connection.write(JSON.stringify(req.body.event))
          })
        })
      }))

    _(["SIGINT", "SIGQUIT", "SIGKILL"]).each(function(signal) {
      process.on(signal, function() {
        console.log("see you space cowboy...")
        app.close()
      })
    })


    app.listen(conf.http.port, function() {
      shover.installHandlers(this, {prefix:'/shover'})
      app.close = _(this.close).bind(this)
      if (_(callback).isFunction()) {
        callback(app)
      }
    })
  })
}

if (module.parent === null) {
  exports.start()
}
