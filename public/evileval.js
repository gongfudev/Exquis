define([], function(){

    var evalAnimation = function(codeString, canvasAnim){
        // TODO this is not a path, rename
        var jsAnimPath = toDataUri(codeString);
        return loadJsAnimOnCanvasAnim(jsAnimPath, canvasAnim, canvasAnim.animationName);
    },
        
    loadJsAnimOnCanvasAnim = function(jsAnimPath, canvasAnim, animationName){
        return new Promise(function(resolve, reject){
            require([jsAnimPath],
                    function(animationCode){
                        var animationCodeClone = Object.create(animationCode);
                        //TODO this is not a canvasAnim but an Animation
                        canvasAnim.uri = jsAnimPath;
                        canvasAnim.animationName = animationName;
                        canvasAnim.codeToSetup = animationCodeClone;
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
        
    toDataUri = function(jsCode){
        return "data:text/javascript;base64," + btoa(jsCode);
    },

    dataUri2text = function(uri){
        return atob(uri.substr(28));
    },
        
    // this is only used by the json2js script for converting legacy animations
    stringifyJSON = function (jsonAnim){
        var string = "define({libs:" + jsonAnim.libs + ",\n";
        string += "setup: function(context, lib){\n"+ jsonAnim.setup +"},\n";
        string += "draw: function(context, borders, lib){\n"+ jsonAnim.draw +"}});";
        return string; 
    };
	
    return {
        loadJsAnimOnCanvasAnim:loadJsAnimOnCanvasAnim,
        evalAnimation: evalAnimation,
        toDataUri: toDataUri,
        dataUri2text: dataUri2text,
        stringifyJSON: stringifyJSON  
    };

});
