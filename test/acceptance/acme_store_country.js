process.env.NODE_ENV = "test"

var express = require("express")
var request = require("supertest")
var storeCountry = require("../../lib/store_country")


describe("store country", function() {

  before(function() {
    this.knownCountries =
      [ { name: "France", code: "FR" }, { name: "Italy", code: "IT" } ]
  })

  beforeEach(function() {
    var app = this.app = express()
    app
      .use(storeCountry(this.knownCountries))
      .all("/store/life", function(req, res) {
        res.send(200, "store life")
      })
      .all("/us/stored", function(req, res) {
        res.send(200, "stored")
      })
      .all("/hello*", function(req, res) {
        res.send(200, "hello")
      })
      .all("*", function(req, res) {
        res.send(200, "store " + req.country.code)
      })
      .use(function(err, res, req, next) {
        console.log(err)
      })
  })

  it("should redirect to US if not a known country", function(done) {
    request(this.app)
      .get("/zz/store")
      .expect(301)
      .expect("Location", "/us/store", done)
  })

  it("should take the country if known", function(done) {
    request(this.app)
      .get("/fr/store")
      .expect(200, "store fr", done)
  })

  it("should strip country from url", function(done) {
    request(this.app)
      .get("/it/store/life")
      .expect(200, "store life", done)
  })


  describe("when not store", function() {

    it("should ignore on completely different route", function(done) {
      request(this.app)
        .get("/hello")
        .expect(200, "hello", done)
    })

    it("should ignore when word store is used", function(done) {
      request(this.app)
        .get("/hello/funny/store")
        .expect(200, "hello", done)
    })

    it("sould ignore when store is a substring", function(done) {
      request(this.app)
        .get("/us/stored")
        .expect(200, "stored", done)
    })
  })


})
