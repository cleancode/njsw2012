var express = require("express")
var path = require("path")

module.exports = function() {

  var acme = express()
  var resolve = function(relPath) {
    return path.join(__dirname, relPath)
  }
  var logger = function noop(req, res, next) { next() }

  acme.configure("development", function() {
    logger = express.logger("dev")
  })

  acme.set("views", resolve("../views"))
  acme.set("view engine", "jade")

  acme
    .use(logger)
    .use(express.static(resolve("../public")))

  acme.get("/hello", function(req, res) {
    res.send("world")
  })

  acme.get("/store", function(req, res) {
    var albums = require(resolve("../data/albums.json"))
    res.render("store", albums)
  })

  return acme
}
