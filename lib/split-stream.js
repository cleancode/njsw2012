var es = require("event-stream"),
    _ = require("underscore")

module.exports = function split() {
  var soFar = ""

  return es.through(
    function write(buffer) {
      var stream = this, lines = (soFar + buffer).split(/\n/)

      soFar = lines.pop()
      _(lines).each(function(line) {
        stream.emit("data", line + "\n")
      })
      
      return true
    },
    function end() {
      if (soFar !== "") {
        this.emit("data", soFar + "\n")
      }
      this.emit("end")
    }
  )
}
