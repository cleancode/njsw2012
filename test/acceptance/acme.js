var acme = require("../../lib/acme")
var request = require("supertest")

describe("acme", function() {
  it("should say hello world", function(done) {
    request(acme)
      .get("/hello")
      .expect(200, "world", done)
  })
})
