process.env.NODE_ENV = "test"

var acme = require("../../lib/acme")
var Browser = require("zombie")
var expect = require("expect.js")

describe("acme store ui", function() {

  beforeEach(function(done) {
    this.browser = new Browser()
    this.server = acme().listen(9101, done)

    this.browser.isGradeA()
    this.browser.waitDuration = 300
    //this.browser.debug = true
  })

  afterEach(function(done) {
    this.server.close(done)
  })

  it("should make people successfully buy albums", function(done) {
    var browser = this.browser
    browser
      .visit("http://localhost:9101/us/store")
      .then(function() {
        expect(browser).to.have.activePage("#buy")
        expect(browser).to.have.manyAlbums(11)
        return browser.clickLink("#buy .album_choose:eq(0)")
      })
      .then(function() {
        expect(browser).to.have.activePage("#pay")
        return browser.pressButton("#pay .pay_button")
      })
      .then(function() {
        expect(browser).to.have.activePage("#thankyou")
      })
      .then(done, done)
  })

  it("should say sorry if they can't buy", function(done) {
    var browser = this.browser
    browser
      .visit("http://localhost:9101/us/store")
      .then(function() {
        expect(browser).to.have.activePage("#buy")
        expect(browser).to.have.manyAlbums(11)
        return browser.pickAnInvalidProduct()
      })
      .then(function() {
        expect(browser).to.have.activePage("#pay")
        return browser.pressButton("#pay .pay_button")
      })
      .then(function() {
        expect(browser).to.have.activePage("#sorry")
      })
      .then(done, done)
  })

})

Browser.prototype.isGradeA = function() {
  var browser = this
  browser.on("evaluated", function(code) {
    var window = browser.window
    var document = browser.document
    if (typeof code === "string" && code.match(/jQuery JavaScript/)) {
      window.$(document).on("mobileinit", function() {
        window.$.mobile.gradeA = function() { return true }
      })
    }
  })
}

Browser.prototype.pickAnInvalidProduct = function(callback) {
  var browser = this
  var firstProduct = browser.query("#buy .album_choose:eq(0)")
  firstProduct.setAttribute("data-code", "")
  return browser.clickLink(firstProduct, callback)
}

expect.Assertion.prototype.activePage = function(page) {
  var browser = this.obj
  expect(browser.query(page).getAttribute('class')).to.contain('ui-page-active')
}

expect.Assertion.prototype.manyAlbums = function(num) {
  var browser = this.obj
  expect(browser.queryAll(".album_choose").length).to.be(num)
}


