var es = require("event-stream")

module.exports = function append(toBeAppended) {
  return es.through(
    function write(buffer) {
      this.emit("data", buffer + toBeAppended)
      return true
    },
    function end() {
      this.emit("end")
    }
  )
}
