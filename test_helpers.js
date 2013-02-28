var simulateClick = function (element) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window,
		       0, 0, 0, 0, 0, false, false, false, false, 0, null);
    element.dispatchEvent(evt);
};


var runAssertions = function(assertions){

    var failure = false;
    
    assertions.forEach(function(assertion){
	failure = failure || ! assert(assertion);
    });
    if(!failure){
	console.log("all tests have passed");
    }

};

var assert = function(assertion){
    if (!assertion[0]){
	console.log("test failure");
	console.log(assertion[1]);
    };
    return assertion[0];
};

var hasClass = function(element, className){
    var result = element.className.match(new RegExp("\\b"+className+"\\b")) ; 
    return result ? true: false;
};
