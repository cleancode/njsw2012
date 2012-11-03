var expect = require("expect.js"),
    split = require("../../lib/split-stream"),
    es = require("event-stream")

describe("split", function() {
  it("should be a function", function() {
    expect(split).to.be.a("function")
  })

  describe("stream", function() {
    beforeEach(function() {
      this.stream = split()
    })

    it("should be writable/readable", function() {
      expect(this.stream).to.have.property("readable", true)
      expect(this.stream).to.have.property("writable", true)
    })

    it("should emit a line when input is a line", function(done) {
      this.stream.pipe(es.writeArray(function(error, lines) {
        expect(lines).to.eql(["aaa"])
        done()
      }))

      this.stream.write("aaa\n")
      this.stream.end()
    })

    it("should not emit a line until newline if found", function(done) {
      this.stream.pipe(es.writeArray(function(error, lines) {
        expect(lines).to.eql(["aaa"])
        done()
      }))

      this.stream.write("a")
      this.stream.write("a")
      this.stream.write("a")
      this.stream.write("\n")
      this.stream.end()

    })

    it("should emit 2 lines when input contains a newline", function(done) {
      this.stream.pipe(es.writeArray(function(error, lines) {
        expect(lines).to.eql(["aaa", "bbb"])
        done()
      }))

      this.stream.write("aaa\nbbb\n")
      this.stream.end()
    })

    it("should emit last characters as a line", function(done) {
      this.stream.pipe(es.writeArray(function(error, lines) {
        expect(lines).to.eql(["aaa", "bbb", "c"])
        done()
      }))

      this.stream.write("aaa\nbbb\nc")
      this.stream.end()
    })
  })
})
