"use strict";

var ajax = (function(){

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
        } 
        for(var i=0; i<jsons.length; i++){
           loadJson(jsons[i], handleJson);
        }

    }

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
        }

        for(var i=0; i<jsons.length; i++){
          var lastrow = i == (jsons.length - 1);
          for(var j=0; j<jsons[i].length; j++){
             var position = {row: i, col: j};
             loadJson(jsons[i][j], handleJson, position);
          }
        }

    }

    //TODO add an error handler callback
    var loadJson = function(path, callback, callbackRestArgs){

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var result = JSON.parse(xmlhttp.responseText);
                callback(result, path, callbackRestArgs);
            }
        }
        xmlhttp.open("GET", path, true);
        xmlhttp.send();
    }

    var saveAnimation = function(cell, callback){
        var path = "/animations/"+cell.animationName+".json",
            JSONString = JSON.stringify({ setup: cell.animation.setupString,
                                          draw : cell.animation.drawString }),
            params = encodeURIComponent(JSONString), 
            ajax = new XMLHttpRequest();;

        ajax.open("POST", path, true);
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajax.onreadystatechange = callback;
        ajax.send(params);
    }

    var loadAnimations = function(){

        loadJson("assemblages/assemblageAvecCarres.json", function(assemblage){
            
            var animationNames = map2dArray(assemblage, makeJsonName);

            loadJsons2d(animationNames, function(jsonAnimations){
                init(jsonAnimations);
            });
            
        });
    }
    return {saveAnimation: saveAnimation, loadAnimations: loadAnimations};
})();


var makeCanvasAndHint = function(row, col){
    var canvas = document.createElement('canvas');
    canvas.id = "canvas-" + row + "-" + col;
    canvas.className = "cell";
    canvas.width = 150;
    canvas.height = 150;
    canvas.style.top = (150*row)+"px";
    canvas.style.left = (150*col)+"px";

    document.getElementById('dashboard').appendChild(canvas);

    var gridHint = document.createElement('div');
    gridHint.id = "hint-" + row + "-" + col;
    gridHint.className = "hint";
    gridHint.style.top = (150*row)+"px";
    gridHint.style.left = (150*col)+"px";

    document.getElementById('grid_hint').appendChild(gridHint);
    return canvas;
}

var map2dArray = function(array2d, func) {
    var result = [];

    for (var row = 0; row < 3; row++) {
        result.push([]);
        for (var col = 0; col < 3; col++) {
            result[row][col] = func(array2d[row][col], row, col);
        };
    };

    return result;
};

var forEach2dArray = function(array2d, func) {
    for (var row = 0; row < array2d.length; row++) {
        for (var col = 0; col < array2d[row].length; col++) {
            func(array2d[row][col], row, col);
        };
    };
};


var makeCell = function(context, jsonAnimation){


    var cell = {
        animation : {},
        animationName: jsonAnimation.name,

        borders : function(){
            return {
                    north: context.getImageData(0, 0, context.canvas.width, 1),
                    south: context.getImageData(0, context.canvas.height - 1, context.canvas.width, 1),
                    east: context.getImageData(context.canvas.width - 1, 0, 1 , context.canvas.height),
                    west: context.getImageData(0, 0, 1, context.canvas.height - 1)
                };
        },

        draw : function(borders){ 
            // force reset matrix
            context.setTransform(1, 0, 0, 1, 0, 0);
            this.animation.draw(context, borders);
        },

        setup : function(){ 
            // force reset matrix
            context.setTransform(1, 0, 0, 1, 0, 0);
            this.animation.setup(context);
        }
    };

    addAnimationToCell(cell, jsonAnimation.animation);

    return cell;

}


var relativeCoordinates = {
    north : {row: -1, col: 0, opposite: "south"},
    south : {row: 1, col: 0, opposite: "north"},
    west : {row: 0, col: -1, opposite: "east"},
    east : {row: 0, col: 1, opposite: "west"}
};

var addSetupToCell = function(targetCell, setupString){
    eval("targetCell.animation.setup = function(context) {" + setupString + "};");
    targetCell.animation.setupString = setupString;
}

var addDrawToCell = function(targetCell, drawString){
    eval("targetCell.animation.draw = function(context, borders) {" + drawString + "};");
    targetCell.animation.drawString = drawString;
}

var functionBodyAsString = function(func){
  return func.toString().replace(/function\s*\([\w\s,]*\)\s*{\n?(\s*[\s\S]*)}/g,"$1");
  //.replace(/\n/g,"\\n");
}


    
var addAnimationToCell = function(cell, animation){
    addDrawToCell(cell, animation.draw);
    addSetupToCell(cell, animation.setup);

};

var makeJsonName = function(animationName){
    return "animations/"+animationName+".json";
}

var init = function (jsonAnimations) {

    var textAreaSetup = document.getElementById("text_area_setup"),
        textAreaDraw = document.getElementById("text_area_draw"),
        editor = document.getElementById("editor"),
        body = document.getElementsByTagName("body")[0],
        animation_file_name = document.getElementById("animation_file_name"),
        saveButton = document.getElementById("save_button");

    
    var targetCell;

    var cells = map2dArray(jsonAnimations,function(jsonAnim,row,col){
        var canvas = makeCanvasAndHint(row, col), 
            context = canvas.getContext("2d"), 
            cell = makeCell(context, jsonAnim),
            edit = function(){ 
                textAreaSetup.value = cell.animation.setupString;
                textAreaDraw.value = cell.animation.drawString;
                animation_file_name.innerText = cell.animationName;
                targetCell = cell;
            };

        canvas.addEventListener('click', edit, false);
        return  cell;
    });


    var onBodyClick = function(event){
       
        if (event.target.id === ""){
            // unselect edition
            editor.className = "invisible";
        }else{
            editor.className = "";
        }
    }

    document.addEventListener('click', onBodyClick, true);

    var showGridHint = function(show){

        forEach2dArray(cells, function(cell, row,col){
            var id = "hint-"+row+"-"+col,
                gridHint = document.getElementById(id);
            gridHint.style.display = show ? "block" : "none";

        });
    }

    var onDashboardOver = function(){ showGridHint(true);};
    var onDashboardOut = function(){ showGridHint(false);};

    document.getElementById("dashboard").addEventListener("mouseover", onDashboardOver, true);
    document.getElementById("dashboard").addEventListener("mouseout", onDashboardOut, true);

    var onSaveClick = function(event){
        ajax.saveAnimation(targetCell);
    }

    saveButton.addEventListener('click', onSaveClick, true);


    textAreaDraw.className = "code_valid";
    textAreaSetup.className = "code_valid";

    textAreaSetup.onkeyup = function(){
             
        targetCell.updateSetup = function(){
            var setupString = textAreaSetup.value;
            try{
                addSetupToCell(targetCell, setupString);
                targetCell.setup();
                textAreaSetup.className = "code_valid";     
            }catch(e){
                textAreaSetup.className = "code_invalid";     
            }
        }
    };

    textAreaDraw.onkeyup = function(){
        //var targetCell = cells[1][1];
    
        targetCell.updateDraw = function(neighbouringBorders){
            var drawString = textAreaDraw.value,
                drawBackup = targetCell.animation.draw;
            try{
                addDrawToCell(targetCell, drawString);
                targetCell.draw(neighbouringBorders);
                textAreaDraw.className = "code_valid";     
            }catch(e){
                throw e;
                console.error(e);
                targetCell.animation.draw = drawBackup;
                targetCell.draw(neighbouringBorders);
                textAreaDraw.className = "code_invalid";     
            }
        }
        
    };

    var draw = function(){

        var allBorders = map2dArray(cells,function(cell){ 
            return cell.borders();
        });
        forEach2dArray(cells,function(cell, row, col){
            var neighbouringBorders = {};
            ["north", "south", "east", "west"].forEach(function(side){
                var offset = relativeCoordinates[side];
                var siderow = (row + offset.row + cells.length) % cells.length;
                var sidecol = (col + offset.col + cells[0].length) % cells[0].length;
                neighbouringBorders[side] = allBorders[siderow][sidecol][offset.opposite];
    
            });

            if(cell.updateSetup){
                cell.updateSetup();
                delete(cell.updateSetup);
            }
            
            if(cell.updateDraw){
                cell.updateDraw(neighbouringBorders);
                delete(cell.updateDraw);
            }else{
                cell.draw(neighbouringBorders);
            }



        });
    };

    forEach2dArray(cells,function(cell){ cell.setup(); });
    setInterval(draw, 50);

};

window.onload = ajax.loadAnimations;
