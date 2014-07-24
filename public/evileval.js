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
	    canvasAnim.animationToSetup.libsString = libsString;
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

    evalAnimation = function(exquis, codeString, canvasAnim, onLoadCallback){
        var jsAnimPath = toDataUri(codeString);
        loadJsAnimOnCanvasAnimP(jsAnimPath, canvasAnim).then(onLoadCallback);
    },
        
    loadJsAnimOnCanvasAnimP = function(jsAnimPath, canvasAnim, position){
        return new Promise(function(resolve, reject){
            require([jsAnimPath],
                    function(animation){
                        var animationClone = Object.create(animation);
                        canvasAnim.uri = jsAnimPath;
                        canvasAnim.animationToSetup = animationClone;
	                if(canvasAnim.hasOwnProperty("setup")){
                            canvasAnim.setup();
                        }
                        resolve(canvasAnim);
                    },
                   function(err){
                       reject(err);
                   });
        });
    },
        
    loadJsAnimOnCanvasAnim = function(exquis, jsAnimPath, canvasAnim, onLoadCallback){
        require([jsAnimPath], function(animation){
            var animationClone = Object.create(animation);
            canvasAnim.uri = jsAnimPath;
            canvasAnim.animation = animationClone;
	    if(canvasAnim.hasOwnProperty("setup")){
                canvasAnim.setup();
            }
            // exquis.loadingCanvasAnim = canvasAnim;
            // exquis.animate(animationClone);
            onLoadCallback(canvasAnim);
            //setTimeout(onLoadCallback, 1000);
        });
    },
        
    toDataUri = function(jsCode){
        return "data:text/javascript;base64," + btoa(jsCode);
    },

    dataUri2text = function(uri){
        return atob(uri.substr(28));
    },
        
    functionBodyAsString = function(func){
	return func.toString().replace(/function\s*\([\w\s,]*\)\s*{\n?(\s*[\s\S]*)}/g,"$1");
    },
        
    addAnimationToCanvasAnim = function(animation, canvasAnim, exquis, onDone){

        exquis.loadingCanvasAnim = canvasAnim;
	addLibsToCanvasAnim(canvasAnim, animation.libs, function(){

	    if(canvasAnim.hasOwnProperty("setup")){
		canvasAnim.setup();
            }
            if(typeof onDone != "undefined"){
                onDone();
            }
	});
    },

    stringify = function(animation){
        var libs = animation.libs,
            string = "define({libs:{",
            libsContent = [];
        for(property in libs){
            if(libs.hasOwnProperty(property)){
                libsContent.push( "\"" + property + "\":\"" + libs[property] +"\"");
            }
        }
        string += libsContent.join(", ") + "},\n";
        string += "draw: " + animation.draw.toString() + ",\n";
        string += "setup: " + animation.setup.toString() + "});";
        return string;
    },
    // this is only used by the json2js script for converting legacy animations
    stringifyJSON = function (jsonAnim){
        var string = "define({libs:" + jsonAnim.libs + ",\n";
        string += "setup: function(context, lib){\n"+ jsonAnim.setup +"},\n";
        string += "draw: function(context, borders, lib){\n"+ jsonAnim.draw +"}});";
        return string; 
    };
	
    return {
        addLibsToCanvasAnim: addLibsToCanvasAnim, 
        addAnimationToCanvasAnim: addAnimationToCanvasAnim,
        loadJsAnimOnCanvasAnim: loadJsAnimOnCanvasAnim,
        loadJsAnimOnCanvasAnimP:loadJsAnimOnCanvasAnimP,
        functionBodyAsString: functionBodyAsString,
        evalAnimation: evalAnimation,
        toDataUri: toDataUri,
        dataUri2text: dataUri2text,
        stringify: stringify,  
        stringifyJSON: stringifyJSON  
    };

});
