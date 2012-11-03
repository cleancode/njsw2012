var expect = require("expect.js"),
    master = require("../.."),
    exec = require("child_process").exec,
    _ = require("underscore"),
    path = require("path"),
    util = require("util"),
    fs = require("fs")

describe('master', function() {
  describe('output of 6 workers', function() {
    beforeEach(function() {
      this.op = path.join(__dirname, "..", "..", ".work", "output")
      this.os = fs.createWriteStream(this.op, {flags: "w+"})
    })

    it('should be 600 lines', function(done) {
      var self = this
      master.run(6).pipe(self.os).on("close", function() {
        exec(util.format("cat %s | wc -l", self.op), function(error, stdout, stderr) {
          expect(parseInt(stdout.trim(), 10)).to.be(600)
          done()
        })
      })
    })
    it('should be 1000 characters per line + newline', function(done) {
      var self = this
      master.run(6).pipe(self.os).on("close", function() {
        exec(util.format("cat %s | while read line; do echo $line | wc -c; done | sort | uniq", self.op), function(error, stdout, stderr) {
          var lines = _(stdout.trim().split(/\n/)).map(function(charactersInLine) {return parseInt(charactersInLine, 10)})
          expect(lines).to.eql([1001])
          done()
        })
      })
    })
  })
})
