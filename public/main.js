
var main = function(net, exquisInit, evileval){
    window.x = {
        animate : function(animation){
            var that = this;
            that.loadingCanvasAnim.animationToSetup = animation;
	    evileval.addLibsToCanvasAnim(that.loadingCanvasAnim, animation.libs, function(){
	        if(that.loadingCanvasAnim.hasOwnProperty("setup")){
                    that.loadingCanvasAnim.setup();
                }
	    });
    }};
    window.load = function(){
        net.loadAnimations(window.x, exquisInit);
    };
    window.onerror = function(message, url, lineNumber){
        console.log(message +" "+ url +" "+ lineNumber);
    };
    window.test = function(){
        require(["tests/clientTest"],
                function(clientTest){
                    try{
                        clientTest.test(net);
                    }catch(e){
                        console.error(e.stack);
                    }
                },
                function(err){
                    console.log(err);
                    console.log("tests have been disabled");
                });
    }; 
    window.load();
};

require(["net", "exquis", "evileval", "lib/domReady!"], main);
