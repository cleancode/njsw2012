var express = require("express")
var path = require("path")
var _ = require("underscore")
var request = require("superagent")

module.exports = function() {

  var acme = express()
  var resolve = function(relPath) {
    return path.join(__dirname, relPath)
  }
  var logger = function noop(req, res, next) { next() }
  var db = require(resolve("db"))()
  var storeCountry = require(resolve("store_country"))


  acme.configure("development", function() {
    logger = express.logger("dev")
  })

  acme.set("views", resolve("../views"))
  acme.set("view engine", "jade")
  acme.set("shover url", "http://localhost:9000/events")

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

  acme.get("/api/sales", function(req, res) {
    res.send(200, {
      sales: _(db.sales).map(function(sales, country) {
        return { country: country, count: sales.length }
      })
    })
  })

  acme.post("/store/buy", function(req, res) {
    var albumCode = req.body.code
    var album = _(db.albums).find(function(album) { return album.code === albumCode })
    var country = req.country

    if (!album) { res.send(400) }

    db.saleIn({ code: albumCode, date: new Date() }, country.code)
    request
      .post(acme.get("shover url"))
      .send({
        event: {
          country: country.code,
          count: db.salesBy(country.code).length
        }
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .on("error", function(err) {})
      .end(function(err, res) {})
    res.send(201)
  })

  acme.use(function(err, req, res, next) {
    console.log("ERROR: ", err)
  })

  return acme
}
