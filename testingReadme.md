
based on
http://net.tutsplus.com/tutorials/javascript-ajax/headless-functional-testing-with-selenium-and-phantomjs/

dependencies
------------

selenium server  (download jar)
phantomjs (see site for instructions)

mocha (npm -g install mocha)
chai (add to package.json and run npm install afterwards)
webdriverjs (add to package.json run npm install afterwards)



procedure
---------

1. start selenium-server -> java -jar selenium-server-standalone-2.28.0.jar


2. run tests -> mocha -R spec -t 5000
by default mocha runs tests in ./test/*.js
