var db = module.exports = {}

var dbPath = __dirname + "/" + "../data"
var albumsJson = require(dbPath + "/albums.json")

db.albums = albumsJson.albums
db.sales = []
