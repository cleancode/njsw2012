var express = require("express")
var path = require("path")
var _ = require("underscore")

module.exports = function() {

  var acme = express()
  var resolve = function(relPath) {
    return path.join(__dirname, relPath)
  }
  var logger = function noop(req, res, next) { next() }
  var db = require(resolve("db"))

  acme.configure("development", function() {
    logger = express.logger("dev")
  })

  acme.set("views", resolve("../views"))
  acme.set("view engine", "jade")

  acme
    .use(logger)
    .use(express.bodyParser())
    .use(express.static(resolve("../public")))

  acme.get("/hello", function(req, res) {
    res.send("world")
  })

  acme.get("/store", function(req, res) {
    res.render("store", { albums: db.albums })
  })

  acme.post("/store/buy", function(req, res) {
    var code = req.body.code
    var album = _(db.albums).find(function(album) { return album.code === code })

    if (!album) {
      res.send(400)
    }
    db.sales.push({ code: code, date: new Date() })
    res.send(201)
  })

  acme.use(function(err, req, res, next) {
    console.log("ERROR: ", err)
  })

  return acme
}
