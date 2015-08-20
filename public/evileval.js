define([], function(){

    var loadJsAnim = function(jsAnimPath){
        return new Promise(function(resolve, reject){
            require([jsAnimPath],
                    function(evaluatedAnimation){
                        resolve(Object.create(evaluatedAnimation));
                    },
                    function(err){
                        reject(err);
                    });
        });
    };
    
    var toDataUri = function(jsCode){
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
        loadJsAnim: loadJsAnim , 
        toDataUri: toDataUri,
        dataUri2text: dataUri2text,
        stringifyJSON: stringifyJSON  
    };

});
