var expect = require("expect.js"),
    append = require("../../lib/append-stream"),
    es = require("event-stream")

describe("append", function() {
  it("should be a function", function() {
    expect(append).to.be.a("function")
  })

  describe("stream to append newline", function() {
    beforeEach(function() {
      this.stream = append("\n")
    })

    it("should be writable/readable", function() {
      expect(this.stream).to.have.property("readable", true)
      expect(this.stream).to.have.property("writable", true)
    })

    it("should append a string ad the end of every data", function(done) {
      this.stream.pipe(es.writeArray(function(error, lines) {
        expect(lines).to.eql(["aaa\n"])
        done()
      }))

      this.stream.write("aaa")
      this.stream.end()
    })
  })
})
