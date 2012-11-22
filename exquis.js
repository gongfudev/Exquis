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

    var saveAnimation = function(cell, callback, fileName){
        var name = fileName || cell.animationName,
            path = "/animations/"+name+".json",
            JSONString = JSON.stringify({ setup: cell.animation.setupString,
                                          draw : cell.animation.drawString }),
            params = encodeURIComponent(JSONString), 
            ajax = new XMLHttpRequest();

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

var makeCell = function(row, col, height, width, jsonAnim){
    var canvas = makeCanvas(row, col, height, width), 
        context = canvas.getContext("2d"); 
    return {
        canvasAnim: makeCanvasAnimation(context, jsonAnim),
        hint: makeHint(row, col, height, width)
    };
}

var makeCanvasAnimation = function(context, jsonAnimation){


    var canvasAnim = {
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

    addAnimationToCanvasAnim(canvasAnim, jsonAnimation.animation);

    return canvasAnim;

}



var relativeCoordinates = {
    north : {row: -1, col: 0, opposite: "south"},
    south : {row: 1, col: 0, opposite: "north"},
    west : {row: 0, col: -1, opposite: "east"},
    east : {row: 0, col: 1, opposite: "west"}
};

var addSetupToCanvasAnim = function(canvasAnim, setupString){
    eval("canvasAnim.animation.setup = function(context) {" + setupString + "};");
    canvasAnim.animation.setupString = setupString;
}

var addDrawToCanvasAnim = function(canvasAnim, drawString){
    eval("canvasAnim.animation.draw = function(context, borders) {" + drawString + "};");
    canvasAnim.animation.drawString = drawString;
}

var functionBodyAsString = function(func){
  return func.toString().replace(/function\s*\([\w\s,]*\)\s*{\n?(\s*[\s\S]*)}/g,"$1");
  //.replace(/\n/g,"\\n");
}
    
var addAnimationToCanvasAnim = function(canvasAnim, animation){
    addDrawToCanvasAnim(canvasAnim, animation.draw);
    addSetupToCanvasAnim(canvasAnim, animation.setup);

};

var makeJsonName = function(animationName){
    return "animations/"+animationName+".json";
}



var makeCanvas = function(row, col, height, width){
    var canvas = document.createElement('canvas');
    canvas.id = "canvas-" + row + "-" + col;
    canvas.className = "cell";
    canvas.width = width;
    canvas.height = height;
    canvas.style.top = (height * row)+"px";
    canvas.style.left = (width * col)+"px";

    document.getElementById('dashboard').appendChild(canvas);
    return canvas;
};

var makeHint = function(row, col, height, width){
    var gridHint = document.createElement('div');
    gridHint.id = "hint-" + row + "-" + col;
    gridHint.className = "hint";
    gridHint.style.top = (height * row)+"px";
    gridHint.style.left = (width * col)+"px";

    document.getElementById('dashboard').appendChild(gridHint);
    return gridHint;
};

var addClass = function(element, className){
    element.className += " "+className;
}

var removeClass = function(element, className){
    element.className = element.className.replace(" "+className, "");
}

var addHintListeners = function(cells){
    var showGridHint = function(show){

        forEach2dArray(cells, function(cell, row,col){
            var id = "hint-"+row+"-"+col,
                gridHint = document.getElementById(id);

            (show ? addClass : removeClass)(gridHint, "visible-grid");

        });
    }

    var onDashboardOver = function(e){  showGridHint(true);};
    var onDashboardOut = function(e){ showGridHint(false);};

    document.getElementById("dashboard").addEventListener("mouseover", onDashboardOver, false);
    document.getElementById("dashboard").addEventListener("mouseout", onDashboardOut, false);

}

var addEditListeners = function (cells) {

    var onDashboardClick = function(e){
        console.log(e.target.id);
    }

    document.getElementById("dashboard").addEventListener("click", onDashboardClick, false);
}



var cells;

var init = function (jsonAnimations) {

    var textAreaSetup = document.getElementById("text_area_setup"),
        textAreaDraw = document.getElementById("text_area_draw"),
        editor = document.getElementById("editor"),
        body = document.getElementsByTagName("body")[0],
        animation_file_name = document.getElementById("animation_file_name"),
        saveButton = document.getElementById("save_button"),
        saveAsButton = document.getElementById("save_as_button");

    
    var targetCell;

    cells = map2dArray(jsonAnimations,function(jsonAnim,row,col){
        var height = 150,
            width = 150,
            cell = makeCell(row, col, height, width, jsonAnim),
            edit = function(){ 
                textAreaSetup.value = cell.canvasAnim.animation.setupString;
                textAreaDraw.value = cell.canvasAnim.animation.drawString;
                animation_file_name.innerText = cell.canvasAnim.animationName;
                if (targetCell) { removeClass(targetCell.hint, "visible-cell"); }
                targetCell = cell;
                addClass(targetCell.hint, "visible-cell");
            };
        cell.hint.addEventListener('click', edit, false);
        return  cell;
    });



    var onBodyClick = function(event){
       
        if (event.target.id === ""){
            // unselect edition
            editor.className = "invisible";
            if (targetCell) { removeClass(targetCell.hint, "visible-cell"); }
        }else{
            editor.className = "";
        }
    }

    document.addEventListener('click', onBodyClick, true);


    addHintListeners(cells);

    var onSaveClick = function(event){
        ajax.saveAnimation(targetCell.canvasAnim);
    }

    saveButton.addEventListener('click', onSaveClick, true);

    var onSaveAsClick = function(){
        var fileName = prompt("enter file name");

        if (fileName){
            ajax.saveAnimation(targetCell.canvasAnim, null, fileName);
            animation_file_name.innerText = fileName;
        }        
       
    }

    saveAsButton.addEventListener('click', onSaveAsClick, true);

    textAreaDraw.className = "code_valid";
    textAreaSetup.className = "code_valid";

    textAreaSetup.onkeyup = function(){
             
        targetCell.canvasAnim.updateSetup = function(){
            var setupString = textAreaSetup.value,
                canvasAnim = targetCell.canvasAnim;
            try{
                addSetupToCanvasAnim(canvasAnim, setupString);
                canvasAnim.setup();
                textAreaSetup.className = "code_valid";     
            }catch(e){
                textAreaSetup.className = "code_invalid";     
            }
        }
    };

    textAreaDraw.onkeyup = function(){
        targetCell.canvasAnim.updateDraw = function(neighbouringBorders){
            var drawString = textAreaDraw.value,
                canvasAnim = targetCell.canvasAnim,
                drawBackup = canvasAnim.animation.draw;
            try{
                addDrawToCanvasAnim(canvasAnim, drawString);
                canvasAnim.draw(neighbouringBorders);
                textAreaDraw.className = "code_valid";     
            }catch(e){
                throw e;
                console.error(e);
                canvasAnim.animation.draw = drawBackup;
                canvasAnim.draw(neighbouringBorders);
                textAreaDraw.className = "code_invalid";     
            }
        }
        
    };

    var draw = function(){

        var allBorders = map2dArray(cells,function(cell){ 
            return cell.canvasAnim.borders();
        });
        forEach2dArray(cells,function(cell, row, col){
            var neighbouringBorders = {},
                canvasAnim = cell.canvasAnim;
            ["north", "south", "east", "west"].forEach(function(side){
                var offset = relativeCoordinates[side];
                var siderow = (row + offset.row + cells.length) % cells.length;
                var sidecol = (col + offset.col + cells[0].length) % cells[0].length;
                neighbouringBorders[side] = allBorders[siderow][sidecol][offset.opposite];
    
            });

            if(canvasAnim.updateSetup){
                canvasAnim.updateSetup();
                delete(canvasAnim.updateSetup);
            }
            
            if(canvasAnim.updateDraw){
                canvasAnim.updateDraw(neighbouringBorders);
                delete(canvasAnim.updateDraw);
            }else{
                canvasAnim.draw(neighbouringBorders);
            }
        });
    };

    forEach2dArray(cells,function(cell){ cell.canvasAnim.setup(); });
    setInterval(draw, 50);

};

window.onload = ajax.loadAnimations;
