"use strict";

define(["iter2d", "evileval"], function(iter2d, evileval){
    

    var loadAnimations2d = function(animationNames, callback ){

        var results = [];
        var totalFileCount = 0;
        for(var i=0; i<animationNames.length; i++){
          totalFileCount += animationNames[i].length;
        }

        var loadedFileCount = 0;

        // TODO: remove (obsolete: we are now loading everything synchronously)
        var handleAnimation = function(result, path, position){
            var name =  /animations\/(\w+)\.js/.exec(path)[1];
            
            if(results[position.row] === undefined){
                results[position.row] = [];
            }

            results[position.row][position.col] = { animation: result,
                                                    name: name };
            loadedFileCount++;

            if (loadedFileCount === totalFileCount){
                callback(results);
            }
        };

        for(var i=0; i<animationNames.length; i++){
          var lastrow = i == (animationNames.length - 1);
          for(var j=0; j<animationNames[i].length; j++){
             var position = {row: i, col: j},
                 animationName = animationNames[i][j];
             if(isExternalJs(animationName)){
                 //TODO this does not work
                animationName = /http:.*\/(\w+\.js)/.exec(animationName)[1];
             }
             console.log(animationName); 
             
             loadJsonAnimation(animationName, handleAnimation, position);
          }
        }

    };

    var isExternalJs = function(url){
        return url.match(/http:\/\//);
    };
    
    //TODO add an error handler callback
    var loadJsonAnimation = function(path, callback, callbackRestArgs){
        if(path.match(/.js$/)){
            //TODO this line appears 3 times in this file goddammit
            var name =  /animations\/(\w+)\.js(on)?/.exec(path)[1];
            evileval.loadJsAnimOnCanvasAnim(x, path, {}, function(){
                var animation = { setup : evileval.functionBodyAsString(x.loadingCanvasAnim.animation.setup),
                                  draw:  evileval.functionBodyAsString(x.loadingCanvasAnim.animation.draw),
                                  libs:"{}",
                                  js: x.loadingCanvasAnim.animation};
                callback(animation, path, callbackRestArgs);
            });
           
            return;
        }else if(path.match(/animations.*.json$/)){
            var onJsonLoad = function(result, path, callbackRestArgsWAWA){
                var fakeCanvasAnim = {animation:{}};
                /*                var fakeCanvasAnim = {animation:{}},
                 onEvilDone = function(){
                        result.js = fakeCanvasAnim.animation;
                        callback(result, path, callbackRestArgs);
                    };

	    try{
                    evileval.addAnimationToCanvasAnim(result, fakeCanvasAnim,
                                                      {loadingCanvasAnim:fakeCanvasAnim},
                                                      onEvilDone);
	        }catch(e){
                    console.error(e);
                 }
            */
                evileval.evalInScript(x, evileval.stringifyJSON(result), fakeCanvasAnim);  
                result.js = fakeCanvasAnim.animation;
                callback(result, path, callbackRestArgs);
            };
            loadJson(path, onJsonLoad);
            
        }else{
            loadJson(path, callback, callbackRestArgs);
        }
        
    };
    
    var loadJson = function(path, callback, callbackRestArgs){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var result = JSON.parse(xmlhttp.responseText);
                callback(result, path, callbackRestArgs);
            }
        };
        xmlhttp.open("GET", path, true);
        xmlhttp.send();
    };
    
    var saveAnimation = function(canvasAnim, callback, fileName){
        var JSString = evileval.stringify(canvasAnim.animation),
            dirName = "animations",
            name = (fileName || canvasAnim.animationName) + ".js";

        saveFile(dirName, name, JSString, callback);
    };

    var saveAssemblage = function(assName, assemblage, callback){
        var JSONString = JSON.stringify(assemblage),
            dirName = "assemblages",
            name = assName + ".json";
            
        saveFile(dirName, name, JSONString, callback);
    };
    
    var saveFile = function(dirName, fileName, content, callback){
        var path = "/" + dirName + "/" + fileName,
            params = encodeURIComponent(content), 
            ajax = new XMLHttpRequest();

        ajax.open("POST", path, true);
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajax.onreadystatechange = callback;
        ajax.send(params);
        
    };

    
    var makeAnimationFileName = function(animationName){
        var name = "/animations/"+animationName;
	return name.match(/.js$/) ? name : name + ".json";
    };

    var loadAssemblage = function(exquis, assName, handleJsonAnimations){
	var assemblagePath = "/assemblages/";
	
        if(!assName){
            assName =  "assemblageAvecSinus",
            history.pushState({},"...", "/assemblage/" + assName);
        }
	assemblagePath += assName + ".json";

        loadJson(assemblagePath, function(assemblage){
            
            var animationNames = iter2d.map2dArray(assemblage, makeAnimationFileName);

            loadAnimations2d(animationNames, function(jsonAnimations){
                handleJsonAnimations(exquis, assName, jsonAnimations);
            });
            
        });
    };


    var loadAnimations = function(exquis, handleJsonAnimations){
	var name = window.location.pathname.substr("/assemblage/".length);
	loadAssemblage(exquis, name, handleJsonAnimations);
    };

    return {saveAnimation: saveAnimation,
	    loadAnimations: loadAnimations,
	    loadJsonAnimation: loadJsonAnimation,
	    loadJson: loadJson,
	    makeJsonName: makeAnimationFileName,
            saveAssemblage: saveAssemblage};
    
});
