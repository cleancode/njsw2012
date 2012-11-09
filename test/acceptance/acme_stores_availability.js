process.env.NODE_ENV = "test"

var express = require("express")
var request = require("supertest")
var expect = require("expect.js")
var storesAvailability = require("../../lib/stores_availability")


describe("stores availability", function() {

  beforeEach(function() {
      var app = this.app = express()
      app.use(express.bodyParser())
      this.store = {}
  })

  describe("controller", function() {
    beforeEach(function() {
      this.app.use(storesAvailability(this.store).controller)
    })

    it("should open the store if open is true", function(done) {
      var store = this.store

      request(this.app)
        .put("/stores/open")
        .send({ open: true })
        .expect(200)
        .end(function(res) {
          expect(store.open).to.be(true)
          done()
        })
    })

    it("should close the store if open is false", function(done) {
      var store = this.store

      request(this.app)
        .put("/stores/open")
        .send({ open: false })
        .expect(200)
        .end(function(res) {
          expect(store.open).to.be(false)
          done()
        })
    })

  })

  describe("filter", function() {
    beforeEach(function() {
      this.app.use(storesAvailability(this.store).filter)
      this.app.get("/store", function(req, res) { res.send("store") })
    })

    it("should allow store requests if store is open", function(done) {
      this.store.open = true

      request(this.app)
        .get("/store")
        .expect(200, "store", done)
    })

    describe("store is closed", function() {
      beforeEach(function() {
        this.store.open = false
      })

      it("should ignore non store requests", function(done) {
        this.app.get("/hello", function(req, res) { res.send("hello") })
        request(this.app)
          .get("/hello")
          .expect(200, "hello", done)
      })

      it("should return 503 if client does not accept html", function(done) {
        request(this.app)
          .get("/store")
          .set("Accept", "application/json")
          .expect(503, done)
      })

      it("should redirect to error page if client accepts html", function(done) {
        this.store.errorPage = "/store_down"
        request(this.app)
          .get("/store")
          .set("Accept", "text/html")
          .expect(302, done)
          .expect("Location", this.store.errorPage)
      })
    })

  })

})
