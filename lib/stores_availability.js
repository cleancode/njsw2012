module.exports = function(store) {

  return {

    controller: function(req, res, next) {
      if (req.path === "/stores/open" && req.method === "PUT") {
        store.open = req.body.open
      }
      res.send(200)
    },

    filter: function(req, res, next) {
      if (!req.path.match(/^\/store/)) { return next() }
      if (store.open) { return next() }
      if (req.accepts('html')) {
        res.redirect(store.errorPage)
      }
      res.send(503)
    }

  }

}
