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
  var storeCountry = require(resolve("store_country"))

  acme.configure("development", function() {
    logger = express.logger("dev")
  })

  acme.set("views", resolve("../views"))
  acme.set("view engine", "jade")

  acme
    .use(logger)
    .use(express.bodyParser())
    .use(express.static(resolve("../public")))
    .use(storeCountry(db.countries))

  acme.get("/hello", function(req, res) {
    res.send("world")
  })

  acme.get("/store", function(req, res) {
    res.render("store", { albums: db.albums, country: req.country })
  })

  acme.post("/store/buy", function(req, res) {
    var albumCode = req.body.code
    var album = _(db.albums).find(function(album) { return album.code === albumCode })
    var country = req.country

    if (!album) { res.send(400) }

    db.saleIn({ albumCode: albumCode, date: new Date() }, country)
    res.send(201)
  })

  acme.use(function(err, req, res, next) {
    console.log("ERROR: ", err)
  })

  return acme
}
