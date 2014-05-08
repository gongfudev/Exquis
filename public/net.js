"use strict";

define(["iter2d", "evileval"], function(iter2d, evileval){
    

    var loadAnimations2d = function(animationNames, callback ){
        

        var results = [];
        var addToResults = function(result, path, position){
            var name =  /animations\/(\w+)\.js/.exec(path)[1];
            
            if(results[position.row] === undefined){
                results[position.row] = [];
            }

            results[position.row][position.col] = { animation: result,
                                                    name: name };
        };
        var addToResultsAndCallback =  function(result, path, position){
            addToResults(result, path, position);
            callback(results);
        };

        for(var i=0; i<animationNames.length; i++){
          var lastrow = i == (animationNames.length - 1);
          for(var j=0; j<animationNames[i].length; j++){
             var position = {row: i, col: j},
                 animationName = animationNames[i][j],
                 lastcol = j == (animationNames[i].length - 1),
                 handleAnimation = lastcol && lastrow ? addToResultsAndCallback : addToResults;
             if(isExternalJs(animationName)){
                 //TODO this does not work
                animationName = /http:.*\/(\w+\.js)/.exec(animationName)[1];
             }
             loadAnimation(animationName, handleAnimation, position);
          }
        }
    };

    var isExternalJs = function(url){
        return url.match(/http:\/\//);
    };
    
    //TODO add an error handler callback
    var loadAnimation = function(path, handleAnimation, handleAnimationRestArgs){
        evileval.loadJsAnimOnCanvasAnim(x, path, {}, function(){
            var animation =  x.loadingCanvasAnim.animation;
            handleAnimation(animation, path, handleAnimationRestArgs);
        });
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
        return "/animations/"+animationName + ".js";
    };

    var loadAssemblage = function(exquis, assName, handleAnimCodes){
	var assemblagePath = "/assemblages/";
	
        if(!assName){
            assName =  "assemblageAvecSinus",
            history.pushState({},"...", "/assemblage/" + assName);
        }
	assemblagePath += assName + ".json";

        loadJson(assemblagePath, function(assemblage){
            
            var animationNames = iter2d.map2dArray(assemblage, makeAnimationFileName);

            loadAnimations2d(animationNames, function(animCodes){
                handleAnimCodes(exquis, assName, animCodes);
            });
            
        });
    };


    var loadAnimations = function(exquis, handleJsonAnimations){
	var name = window.location.pathname.substr("/assemblage/".length);
	loadAssemblage(exquis, name, handleJsonAnimations);
    };

    return {saveAnimation: saveAnimation,
	    loadAnimations: loadAnimations,
	    loadAnimation: loadAnimation,
	    loadJson: loadJson,
	    makeAnimationFileName: makeAnimationFileName,
            saveAssemblage: saveAssemblage};
    
});
