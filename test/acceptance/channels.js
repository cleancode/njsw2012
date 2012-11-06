var request = require("supertest"),
    expect = require("expect.js"),
    sockjs = require("sockjs-client"),
    configure = require("../../lib/configure"),
    util = require("util"),
    path = require("path"),
    _ = require("underscore")


describe("shover", function() {
  describe("on socket", function() {
    describe("identify", function() {
      it("should bind a channel to an user", function(done) {
        var mocha = this, userId = "5098ba6d3567d3c608be1dc1"

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

    describe("after subscribe to a channel", function() {
      it("should receive messages from that channel", function(done) {
        var mocha = this

        // NOTE: the use of once
        mocha.client.once("data", function(response) {
          mocha.client.once("data", function(event) {
            expect(JSON.parse(event)).to.be.eql(mocha.news.event)
            done()
          })
          mocha.request.post("/channel/news/events/")
            .set("Content-Type", "application/json")
            .send(mocha.news)
            .expect(202)
            .end(mocha.noop)
        })
        mocha.client.write({command: "subscribe", channel: "news"})
      })

      it("should not receive messages from other channels", function(done) {
        var mocha = this

        mocha.client.once("data", function(response) {
          mocha.client.once("data", function(event) {
            expect().fail("should never receive a message")
          })
          mocha.request.post("/channel/news/events/")
            .set("Content-Type", "application/json")
            .send(mocha.news)
            .expect(202)
            .end(function(err, res) {
              setTimeout(done, 10)
            })
        })
        mocha.client.write({command: "subscribe", channel: "meteo"})
      })

      before(function() {
        this.news = {
          event: {
            title: "Node.js Conference in Brescia",
            body: "The best conference in the world held right now in Brescia (IT)"
          }
        }
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
