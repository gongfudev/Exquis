define([], function(){

        var addLibsToCanvasAnim = function(canvasAnim, libsString, callback){
	    if(typeof libsString == "undefined"){
		return;
	    }
						 
	    var libs = JSON.parse(libsString),
		addresses = [],
		aliases = [];
	    
	    for(var name in libs){
		if(libs.hasOwnProperty(name)){
		    addresses.push(name);
		    aliases.push(libs[name]);
		}
	    }
	    // all libraries are reloaded, leave the old ones to the garbage collector
	    canvasAnim.lib = {};
            require(addresses, function(){
		for(var i=0; i<addresses.length; i++){
		    canvasAnim.lib[aliases[i]] = arguments[i];
		}
		canvasAnim.animation.libsString = libsString;
		if(typeof callback != "undefined"){
		    callback();
		}
	    });
        },

        animate = function (obj){
            return obj;
        },
    
        addAnimationStringToCanvasAnim = function(canvasAnim, animationString){
            canvasAnim.animation = eval(animationString);
            canvasAnim.animationString = animationString;
        },
            
        addSetupToCanvasAnim = function(canvasAnim, setupString){
	    eval("canvasAnim.animation.setup = function(context, lib) {" + setupString + "\n};");
	    canvasAnim.animation.setupString = setupString;
	},

	addDrawToCanvasAnim = function(canvasAnim, drawString){
	    eval("canvasAnim.animation.draw = function(context, borders, lib) {" + drawString + "\n};");
	    canvasAnim.animation.drawString = drawString;
	},

	functionBodyAsString = function(func){
	    return func.toString().replace(/function\s*\([\w\s,]*\)\s*{\n?(\s*[\s\S]*)}/g,"$1");
	    //.replace(/\n/g,"\\n");
	},
	addAnimationToCanvasAnim = function(animation, canvasAnim){
            var that = this;
	    
	    addLibsToCanvasAnim(canvasAnim, animation.libs, function(){
	        addSetupToCanvasAnim.call(that, canvasAnim, animation.setup);
	        addDrawToCanvasAnim.call(that, canvasAnim, animation.draw);
		canvasAnim.setup();
	    });
	};
	
    return {
        addLibsToCanvasAnim: addLibsToCanvasAnim, 
	addAnimationStringToCanvasAnim: addAnimationStringToCanvasAnim,
        addAnimationToCanvasAnim: addAnimationToCanvasAnim,
	addDrawToCanvasAnim: addDrawToCanvasAnim,
	addSetupToCanvasAnim: addSetupToCanvasAnim
    };

});
