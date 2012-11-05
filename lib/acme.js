var express = require("express")
var path = require("path")
var acme = module.exports = express()

acme.set("views", path.join(__dirname, "../views"))
acme.set("view engine", "jade")

acme.get("/hello", function(req, res) {
  res.send("world")
})

acme.get("/store", function(req, res) {
  res.render("store")
})
