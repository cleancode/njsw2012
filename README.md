# 0 - WELCOME (09:30 - 10:00) - F+G

* disclaimer: this is our way, not a good one, not bad one, but a way that works for us
* what a would like to see/do in a workshop and why?
* agenda
* networking: what do you know about node.js, why, and what do you like to do in the future with node.js
* setup working environment


# 1 - ENVIRONMENT - branch/skel (10:00 - 10:30) - G

* flow: git/github and pull requests
* tools: vim (local vim), zsh, nvm/npm, and dotfiles
* immediate feedback: syntastic, notifications and informative workspace (execute spec inside vim)?
* specifications: mocha and expect
* build automation: jake, something like foreman? deploy?
* use the keyboard Luke: i3, vim (shell plugin), vimium


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
    * Pop quiz by Federico Galassi


# 3 - SHOVER - branch/shover (12:30 - 13:30 + 14:30 - 15:30) - G

* ?


# 4 - ACME - branch/acme (15:30 - 16:30) - F

* ?


# 5 - PRODUCTION - branch/production (16:30 - 17:30) - F

* deployment
* error checking
* monitoring
* performance
* logging
* debugging


# 6 - Q/A (17:30 - 18:30) - F

* ?
