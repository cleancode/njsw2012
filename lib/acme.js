var express = require("express")

var acme = module.exports = express()

acme.get("/hello", function(req, res) {
  res.send("world")
})
