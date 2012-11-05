var connect = require("connect"),
    router = require("urlrouter"),
    configure = require("./lib/configure"),
    logger = require("./lib/logger"),
    _ = require("underscore")


exports.start = function(callback) {
  configure("./etc/conf.yml", function(conf) {
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
      }))

    _(["SIGINT", "SIGQUIT", "SIGKILL"]).each(function(signal) {
      process.on(signal, function() {
        console.log("see you space cowboy...")
        app.close()
      })
    })

    app.listen(conf.http.port, function() {
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
