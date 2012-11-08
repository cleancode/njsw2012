var db = module.exports = function() {

  var dbPath = __dirname + "/" + "../data"
  var albumsJson = require(dbPath + "/albums.json")
  var countriesJson = require(dbPath + "/countries.json")

  var db = {}

  db.albums = albumsJson.albums
  db.countries = countriesJson.countries

  db.sales = {}
  db.saleIn = function(data, country) {
    if (!db.sales[country]) { db.sales[country] = [] }
    db.sales[country].push(data)
  }
  db.salesBy = function(country) {
    return db.sales[country] || []
  }

  return db
}
