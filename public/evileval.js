define([], function(){

        var addLibsToCanvasAnim = function(canvasAnim, jsonString){
           //TODO
        },
    
        addSetupToCanvasAnim = function(canvasAnim, setupString){
	    eval("canvasAnim.animation.setup = function(context) {" + setupString + "\n};");
	    canvasAnim.animation.setupString = setupString;
	},

	addDrawToCanvasAnim = function(canvasAnim, drawString){
	    eval("canvasAnim.animation.draw = function(context, borders) {" + drawString + "\n};");
	    canvasAnim.animation.drawString = drawString;
	},

	functionBodyAsString = function(func){
	    return func.toString().replace(/function\s*\([\w\s,]*\)\s*{\n?(\s*[\s\S]*)}/g,"$1");
	    //.replace(/\n/g,"\\n");
	},
	addAnimationToCanvasAnim = function(animation, canvasAnim){
	    addDrawToCanvasAnim(canvasAnim, animation.draw);
	    addSetupToCanvasAnim(canvasAnim, animation.setup);
	};
	
    return {
        addLibsToCanvasAnim: addLibsToCanvasAnim, 
	addAnimationToCanvasAnim: addAnimationToCanvasAnim,
	addDrawToCanvasAnim: addDrawToCanvasAnim,
	addSetupToCanvasAnim: addSetupToCanvasAnim
    };

});
