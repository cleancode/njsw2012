/*jshint node: true, strict: false */

var EventEmitter = require("events").EventEmitter
var e = new EventEmitter()

e.on("hello", function() {
    console.log("got hello!")
})

e.emit("hello")

while (1) {}
