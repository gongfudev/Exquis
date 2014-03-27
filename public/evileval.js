define([], function(){

        var addLibsToCanvasAnim = function(canvasAnim, libsString, callback){
	    if(typeof libsString == "undefined"){
		return;
	    }

            //TODO rename libsString to something more reasonable
	    var libs = typeof libsString == "string" ? JSON.parse(libsString): libsString,
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

        createScriptTag = function(onLoadCallback){
            var script = document.createElement('script');
            script.language = "javascript";
            script.type = "text/javascript";
            script.async = false;
            script.addEventListener('load', function(){
                onLoadCallback();
                document.head.removeChild(script);
            });
            document.head.appendChild(script);
            return script;
        },

        evalInScript = function(codeString, onLoadCallback){
            var script = createScriptTag(onLoadCallback);
            script.text = codeString;
        },

        loadJsAnimOnCanvasAnim = function(exquis, jsAnimPath, canvasAnim, onLoadCallback){
            exquis.loadingCanvasAnim = canvasAnim;
            var script = createScriptTag(onLoadCallback);
            script.src = jsAnimPath;

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
	addAnimationToCanvasAnim = function(animation, canvasAnim, onDone){
            var that = this;
	    addLibsToCanvasAnim(canvasAnim, animation.libs, function(){

	        addSetupToCanvasAnim.call(that, canvasAnim, animation.setup);
	        addDrawToCanvasAnim.call(that, canvasAnim, animation.draw);
	        if(canvasAnim.hasOwnProperty("setup")){
		    canvasAnim.setup();
                }
                onDone();
	    });
	};

	
    return {
        addLibsToCanvasAnim: addLibsToCanvasAnim, 
	addAnimationStringToCanvasAnim: addAnimationStringToCanvasAnim,
        addAnimationToCanvasAnim: addAnimationToCanvasAnim,
	addDrawToCanvasAnim: addDrawToCanvasAnim,
	addSetupToCanvasAnim: addSetupToCanvasAnim,
        loadJsAnimOnCanvasAnim: loadJsAnimOnCanvasAnim,
        functionBodyAsString: functionBodyAsString  
    };

});
