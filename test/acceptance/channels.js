var request = require("supertest"),
    expect = require("expect.js"),
    sockjs = require("sockjs-client"),
    configure = require("../../lib/configure"),
    util = require("util"),
    path = require("path")


describe("shover", function() {
  describe("on socket", function() {
    describe("identify", function() {
      it("should bind a channel to an user", function(done) {
        var mocha = this, userId = "5098ba6d3567d3c608be1dc1"

        // TODO: rewrite that with async as an execize?
        mocha.request.get("/user/" + userId)
          .expect(404)
          .end(function(err, res) {
            mocha.client.on("data", function(response) {
              expect(JSON.parse(response)).to.be.eql({result: "ok"})
              mocha.request.get("/user/" + userId)
                .expect(200)
                .end(function(err, res) {
                  expect(res.body).to.have.property("connection")
                  done()
                })
            })
            mocha.client.write({command: "identify", user: userId})
          })
      })

      it("should unbind on disconnect", function(done) {
        var mocha = this, userId = "5098ba6d3567d3c608be1dc1"

        mocha.client.on("data", function(response) {
          mocha.client.on("close", function() {
            mocha.request.get("/user/" + userId)
              .expect(404)
              .end(done)
          })
          mocha.client.close()
        })
        mocha.client.write({command: "identify", user: userId})
      })
    })
  })

  before(function(done) {
    var mocha = this
    configure("../../etc/conf.yml", function(conf) {
      mocha.noop = function() {}
      mocha.baseurl = util.format("http://%s:%d", conf.http.host, conf.http.port)
      mocha.request = request(mocha.baseurl)
      mocha.conf = conf
      done()
    })
  })

  beforeEach(function(done) {
    var mocha = this
    this.client = sockjs.create(this.baseurl + "/shover")
    this.client.on("connection", function(connection) {
      mocha.client.id = path.basename(mocha.client.server.path)
      done()
    })
  })

  afterEach(function(done) {
    if (this.client.isClosed) {
      return done()
    }
    this.client.on("close", function() {
      done()
    })
    this.client.close()
  })
})
