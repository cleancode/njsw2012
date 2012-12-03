# 0 - WELCOME (09:30 - 10:00) - F+G

* disclaimer: this is our way, not a good one, not bad one, but a way that works for us
* what I would like to see/do in a workshop and why?
* agenda
* networking: what do you know about node.js, why, and what do you like to do in the future with node.js
* setup working environment


# 1 - ENVIRONMENT - branch/skel (10:00 - 10:30) - G

* flow: git/github and pull requests
* tools: vim (local vim), zsh, nvm/npm, and dotfiles
* immediate feedback: syntastic, notifications and informative workspace (execute spec inside vim)?
* specifications: mocha and expect
* build automation: jake, forever
* use the keyboard Luke: vim (shell plugin), vimium


# 2 - DNA - branch/streams (10:30 - 12:30) - G/F

* EventEmitter, Stream, Buffer, Process, Socket are the building blocks of Node.js and also of Unix
* Jed Schmidt @ JSConf.eu "streams are to time as arrays are to space"
* SICP ch 3.5 "We can describe the time-varying behavior of a quantity x as a function of time x(t). If we concentrate on x instant by instant, we think of it as a changing quantity. Yet if we concentrate on the entire time history of values, we do not emphasize change, the function itself does not change. If time is measured in discrete steps, the we can model a time function as a (possibly infinite) sequence... streams behaviour does not change with time and yet the user perception here is one of interacting with a system that has a changing state. One way to resolve this paradox is to realize that it is the user's temporal existence that iposes state on the system. If the user could step back from the interaction and think in terms of streams the system would appear stateless"
* ex. sampling every X min, inflate/deflate, encode/decode, pattern detection
* CTM ch 4.3
* look at the Stream.pipe implementation
* look at https://github.com/dominictarr/stream-spec/blob/master/states.markdown
* Stream
    * RESOURCES:
        * http://nodejs.org/api/stream.html
        * https://github.com/substack/stream-handbook
        * https://github.com/dominictarr/stream-spec
        * https://github.com/dominictarr/event-stream - study the code
        * https://github.com/dominictarr/stream-serializer - study the code
        * https://github.com/dominictarr/mux-demux - study the code
        * https://github.com/joyent/node :-)
    * EXERCIZE:
        * initial problem, wrong number of lines and wrong number of lines length in output
        * correct number of lines in output
        * correct length of lines in output
        * append stream
        * more style
    * NOTES:
        * streams don't start until the current coroutine has ended
        * in the second commit of the exercize look at the es.merge/es.concat implementation
* EventEmitter
    * pop quiz by Federico Galassi
    * sockjs-client close method is sync/async based on transport see test/acceptance/events.js


# 3 - SHOVER - branch/shover (12:30 - 13:30 + 14:30 - 15:30) - G

* walking skeleton for an HTTP server: how to test/organize code for HTTP server
* first message on socket: challenge of a three asynchronous actors for an acceptance test
* modularize shover: never forget refactoring
* command identify on socket: exercize with async
* command subscribe and unsubscribe on socket
* channels on redis: shover synchronous interface, gets in the way
* simulator
* how to scale horizontally?
* deploy?


# 4 - ACME - branch/acme (15:30 - 17:30) - F

* connect/express module
    * presentation
    * technologies
        * routing
        * jade
        * stylus
    * a middleware based architecture
    * building a middleware
    * testing
        * routes
        * middlewares
    * exercise: let's build a i18n store without
      changing a line of code

* testing web applications with zombie
    * presentation
    * the event loop
    * better asynchronous programming
    * exercise: read the source Luke

* real time web applications
  * pushing events with sockjs
  * data real time visualization with d3

# 5 - Q/A (17:30 - 18:30) - F

* ?


# NOTES

* repositories with good code
    * https://github.com/dominictarr
    * https://github.com/visionmedia 
    * https://github.com/substack
    * https://github.com/isaacs
    * https://github.com/felixge
    * https://github.com/dshaw
    * https://github.com/LearnBoost
    * https://github.com/joyent
    * https://github.com/nodejitsu
