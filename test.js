
var page = require('webpage').create(),
    system = require('system');


/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
};

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

/*
// Print usage message, if no twitter ID is passed
if (system.args.length < 2) {
    console.log("Usage: tweets.js [twitter ID]");
} else {
    twitterId = system.args[1];
}
*/


 
page.open(encodeURI("http://127.0.0.1:8000/index.html"), function (status) {
  
    // Check for page load success
    if (status !== "success") {
        console.log("Unable to access network");
    } else {
        // Execute some DOM inspection within the page context
	setTimeout(function(){

	    page.injectJs("test_helpers.js");

	    page.evaluate(function() {
		var listOfCanvases = document.getElementsByTagName('canvas'),
		    editor = document.getElementById('editor'),
		    assertions = [];
		assertions.push([hasClass(editor, "invisible"), "the editor should be invisible"]);
		assertions.push([listOfCanvases.length == 9, "we should have nine canvas elements"]);
		var hint = document.getElementById('hint-2-1');
		simulateClick(hint);
		assertions.push([!hasClass(editor, "invisible"), "the editor should be visible"]);
		runAssertions(assertions);


		
	    });
	    phantom.exit();
	}, 1000);
    }
});
