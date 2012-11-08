var connect = require("connect"),
    router = require("urlrouter"),
    configure = require("./lib/configure"),
    logger = require("./lib/logger"),
    Shover = require("./lib/shover"),
    _ = require("underscore")

var async = require("async"),
    request = require("superagent"),
    util = require("util")

exports.start = function(callback) {
  configure("./etc/conf.yml", function(err, conf) {

    var shover = new Shover(conf),
        app = connect()
          .use(logger(conf))
          .use(connect.favicon())
          .use(connect.cookieParser())
          .use(connect.bodyParser())
          .use(function(req, res, next) {
            if (!req.headers['x-shover-request']) {
              shover.racket(function(err, hosts) {
                hosts = _(hosts).unique()
                if (!err && hosts.length > 1) {
                  async.parallel(
                    _(hosts).map(function(host) {
                      return function(next) {
                        if (/.*ping$/.test(req.url)) {
                          request.get(host + req.url)
                            .set('x-shover-request', true)
                            .end(function(res) {
                              next(null, res)
                            })
                        } else if (/.*events$/.test(req.url)) {
                          request.post(host + req.url)
                            .set('x-shover-request', true)
                            .send(req.body)
                            .end(function(res) {
                              next(null, res)
                            })
                        } else {
                          next(null, null)
                        }
                      }
                    }),
                    function(err, results) {
                      if (/ping$/.test(req.url)) {
                        res.end(util.format("pong %d times", results.length))
                      } else if (/events$/.test(req.url)) {
                        res.writeHead(202)
                        res.end()
                      } else {
                        res.end()
                      }
                    }
                  )
                } else {
                  next()
                }
              })
            } else {
              next()
            }
          })

          // TODO: could be something like
          // .use(scatter(function(router) {
          //   router.get("/ping", function(req, res, gathered) {
          //     res.end("ping", gathered.length, "times")
          //   })
          // }))

          .use(router(function(app) {
            app.get("/ping", function(req, res) {
              res.setHeader("Content-Type", "text/plain")
              res.write("pong")
              res.end()
            })

            app.post("/events", function(req, res) {
              res.writeHead(202)
              res.end()
              shover.broadcast(req.body)
            })

            app.post("/channel/:name/events", function(req, res) {
              res.writeHead(202)
              res.end()
              shover.channel(req.params.name).send(req.body)
            })

            app.get("/user/:id", function(req, res) {
              shover.connection(req.params.id, function(error, connection) {
                if (connection && connection.id) {
                  res.writeHead(200, {"Content-Type": "application/json"})
                  res.end(JSON.stringify({connection: connection.id}))
                } else {
                  res.writeHead(404)
                  res.end()
                }
              })
            })
          }))

    _(["SIGINT", "SIGQUIT", "SIGKILL", "SIGTERM"]).each(function(signal) {
      process.on(signal, function() {
        console.log("see you space cowboy...")
        app.close()
      })
    })

    app.listen(conf.http.port, function() {
      var server = this
      shover.attachTo(server)
      app.close = function() {
        server.close()
        shover.reset()
      }
      if (_(callback).isFunction()) {
        callback(app)
      }
    })
  })
}

if (module.parent === null) {
  exports.start()
}
