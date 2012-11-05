var acme = require("../../lib/acme")
var request = require("supertest")

describe("acme", function() {
  it("should say hello world", function(done) {
    request(acme)
      .get("/hello")
      .expect(200, "world", done)
  })

  describe("store", function() {
    it("should have one", function(done) {
      request(acme)
        .get("/store")
        .expect(200, "world")
        .expect("Content-Type", /text\/html/)
        .expect(/Acme Store/, done)
    })
  })

})
