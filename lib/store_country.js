var _ = require("underscore")
module.exports = function(countries) {
  
  var parseRoute = function(path) {
    var match = /^\/(\w\w)(\/store\b.*)/.exec(path)
    return {
      countryCode: match && match[1],
      storePath: match && match[2]
    }
  }
  var isValidCountry = function(countryCode) {
    return countryCode && _(countries).find(function(validCountry) {
      return validCountry.code.toLowerCase() === countryCode.toLowerCase()
    })
  }

  return function(req, res, next) {
    var route = parseRoute(req.path)

    if (!route.storePath) {
      return next()
    }
    if (isValidCountry(route.countryCode)) {
      req.country = { code: route.countryCode }
      req.url = route.storePath
      return next()
    }

    res.redirect(301, "/us" + route.storePath)
  }
}
