var expect = require("expect.js")

var greetings = 'hello world!'

describe('greetings', function() {
  it('should be something about the world', function() {
    expect(greetings).to.contain('world')
  })
})
