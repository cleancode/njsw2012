var expect = require("expect.js"),
    NJSW2012 = require("..")

describe('NJSW2012', function() {
  describe('#what', function() {
    it('should be something nice', function() {
      expect(NJSW2012.what).to.contain('the best')
    })
  })
})
