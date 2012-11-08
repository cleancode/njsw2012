var db = module.exports = {}

var dbPath = __dirname + "/" + "../data"
var albumsJson = require(dbPath + "/albums.json")
var countriesJson = require(dbPath + "/countries.json")

db.albums = albumsJson.albums
db.countries = countriesJson.countries

db.sales = {}
db.saleIn = function(data, country) {
  if (!db.sales[country]) { db.sales[country] = [] }
  db.sales[country].push(data)
}
