"use strict";

define(["iter2d", "evileval"], function(iter2d, evileval){

    var isExternalJs = function(url){
        return url.match(/http:\/\//);
    };
    
    var loadText = function(path, callback){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var result = xmlhttp.responseText;
                callback(result, path);
            }
        };
        xmlhttp.open("GET", path, true);
        xmlhttp.send();
    };
    
    var loadJson = function(path, callback, callbackRestArgs){
        loadText(path, function(text, path){
            var result = JSON.parse(text);
            callback(result, path, callbackRestArgs);
        });
    };
    
    var saveAnimation = function(canvasAnim, callback, fileName){
        if (!canvasAnim.uri.match(/^data:/)){
            return;
        }
        var JSString = evileval.stringify(canvasAnim.currentAnimation),
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
        return "/animations/"+animationName + ".js";
    };

    var makeAnimationFileUri = function(animationName){
        return "/animations/"+animationName + ".js";
    };

    var loadAssemblage = function(exquis, assName, handleAnimCodes){
	var assemblagePath = "/assemblages/";
	
        if(!assName){
            assName =  "assemblageAvecSinus",
            history.pushState({},"...", "/assemblage/" + assName);
        }
	assemblagePath += assName + ".json";
        HTTPgetJSON(assemblagePath)
            .then(function(animationNames){
                var animNamesList = animationNames.reduce(function(a, b) {
                    return a.concat(b);
                }),
                    animPromises =  animNamesList.map(function(animName){
                        var animPath = "/animations/" + animName + ".js";
                        return evileval.loadJsAnimOnCanvasAnimP(animPath, {}, animName);
                    });
                return Promise.all(animPromises);
            }).then(function(animCodes){
                var animCodes2d = splitarray(animCodes, 3);
                handleAnimCodes(exquis, assName, animCodes2d);
            });
    };
    
    var splitarray = function(input, spacing){
        var output = [];
        for (var i = 0; i < input.length; i += spacing){
            output[output.length] = input.slice(i, i + spacing);
        }
        return output;
    };

    var loadAnimations = function(exquis, handleJsonAnimations){
	var name = window.location.pathname.substr("/assemblage/".length);
	loadAssemblage(exquis, name, handleJsonAnimations);
    };
    
    var HTTPget = function(url) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    };

    var HTTPgetJSON = function(url) {
        return HTTPget(url).then(JSON.parse);
    };

    return {saveAnimation: saveAnimation,
	    loadAnimations: loadAnimations,
	    loadText: loadText,
	    loadJson: loadJson,
	    makeAnimationFileUri: makeAnimationFileUri,
            saveAssemblage: saveAssemblage,
            HTTPgetJSON: HTTPgetJSON,
            HTTPget: HTTPget
           };
    
});
