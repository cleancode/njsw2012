var expect = require("expect.js"),
    _ = require("underscore"),
    _ = require("../../lib/underscore-invoke")(_)

describe("invokeSplat", function() {
  it("should be a function", function() {
    expect(_.invokeSplat).to.be.a("function")
  })

  describe("sum", function() {
    it("should return the sum of the array of numbers", function() {
      var sum = function() {
        return _(arguments).reduce(function(sum, number) {
          return sum + number
        }, 0)
      }
      var numbers = _(10).range()
      expect(_(numbers).invokeSplat(sum)).to.be(45)
    })
  })
})
