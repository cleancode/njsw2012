process.env.NODE_ENV = "test"
var acme = require("../../lib/acme")
var request = require("supertest")
var async = require("async")
var expect = require("expect.js")


describe("acme", function() {

  beforeEach(function() {
    this.acme = acme()
  })

  it("should say hello world", function(done) {
    request(this.acme)
      .get("/hello")
      .expect(200, "world", done)
  })

  describe("store", function() {
    it("should have one", function(done) {
      request(this.acme)
        .get("/us/store")
        .expect(200, "world")
        .expect("Content-Type", /text\/html/)
        .expect(/Acme Store/, done)
    })
  })

  describe("api", function() {

    it("should give a list of sales by country", function(done) {
      var acme = this.acme
      async.series([
        function(callback) {
          request(acme)
            .post("/us/store/buy")
            .send({ code: 1001 })
            .end(callback)
        },
        function(callback) {
          request(acme)
            .post("/it/store/buy")
            .send({ code: 1002 })
            .end(callback)
        },
        function(callback) {
          request(acme)
            .post("/us/store/buy")
            .send({ code: 1003 })
            .end(callback)
        },
        function(callback) {
          request(acme)
            .get("/api/sales")
            .expect("Content-Type", /application\/json/)
            .expect(200)
            .end(function(err, res) {
              if (err) throw err
              expect(res.body).to.eql(
                { sales: [
                  { country: "us", count: 2 },
                  { country: "it", count: 1 }
                ]}
              )
              done()
            })
        }
      ])
    })

  })

})
