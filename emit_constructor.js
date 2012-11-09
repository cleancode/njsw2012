/*jshint node: true, strict: false */

var EventEmitter = require("events").EventEmitter

var User = function(name) {
    this.name = name
    this.emit("born", { name: this.name })
}

User.prototype = new EventEmitter()





var fede = new User("federico")
fede.on("born", function(user) {
    console.log(user, "is born")
})
