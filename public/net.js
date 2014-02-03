"use strict";

define(["iter2d"], function(iter2d){
    
    var loadJsons = function(jsons, callback ){

        var results = {};
        var counter = 0;
        var handleJson = function(result, path){
            var name =  /animations\/(\w+)\.json/.exec(path)[1];
            results[name] = result;
            counter ++;
            if (counter == jsons.length ){
                callback(results);
            }
        };
        for(var i=0; i<jsons.length; i++){
           loadJson(jsons[i], handleJson);
        }

    };

    var loadJsons2d = function(jsons, callback ){

        var results = [];
        var totalFileCount = 0;
        for(var i=0; i<jsons.length; i++){
          totalFileCount += jsons[i].length;
        }

        var loadedFileCount = 0;

        var handleJson = function(result, path, position){
                var name =  /animations\/(\w+)\.json/.exec(path)[1];
                
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

        for(var i=0; i<jsons.length; i++){
          var lastrow = i == (jsons.length - 1);
          for(var j=0; j<jsons[i].length; j++){
             var position = {row: i, col: j};
             loadJson(jsons[i][j], handleJson, position);
          }
        }

    };

    //TODO add an error handler callback
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

    var saveAnimation = function(cell, callback, fileName){
        var JSONString = JSON.stringify({ libs: cell.animation.libsString,
					  setup: cell.animation.setupString,
                                          draw : cell.animation.drawString }),
            dirName = "animations",
            name = (fileName || cell.animationName) + ".json";

        saveFile(dirName, name, JSONString, callback);
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

    
    var makeJsonName = function(animationName){
	return "/animations/"+animationName+".json";
    };

    var loadAssemblage = function(assName, pathPrefix, handleJsonAnimations){
	var assemblagePath = pathPrefix + "/assemblages/";
	
        if(!assName){
            assName =  "assemblageAvecSinus",
            history.pushState({},"...", "/assemblage/" + assName);
        }
	assemblagePath += assName + ".json";

        loadJson(assemblagePath, function(assemblage){
            
            var animationNames = iter2d.map2dArray(assemblage, makeJsonName);

            loadJsons2d(animationNames, function(jsonAnimations){
                handleJsonAnimations(assName, jsonAnimations);
            });
            
        });
    };


    var loadAnimations = function(handleJsonAnimations){
	var pathname = window.location.pathname,
            ind = document.URL.indexOf("index.html"),
            pathPrefix = ind ? document.URL.substr(0,ind) : "",
            name = ind ? 0 : pathname.substr("/assemblage/".length);
	loadAssemblage(name, pathPrefix, handleJsonAnimations);
    };

    return {saveAnimation: saveAnimation,
	    loadAnimations: loadAnimations,
	    loadJson: loadJson,
	    makeJsonName: makeJsonName,
            saveAssemblage: saveAssemblage};
    
});
