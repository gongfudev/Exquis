"use strict";

var makeCanvas = function(id){
    var canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = 150;
    canvas.height = 150;

    document.getElementById('dashboard').appendChild(canvas);
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

    addAnimationToCell(cell, jsonAnimation);

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
}

var addDrawToCell = function(targetCell, drawString){
    eval("targetCell.animation.draw = function(context, borders) {" + drawString + "};");
}

var bodyAsString = function(func){
  return func.toString().replace(/function\s*\([\w\s,]*\)\s*{\n([\s\S]+)}/g,"$1").replace(/\n/g,"\\n");
}
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

//TODO add an error handler callback
var loadJson = function(path, callback){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            var result = JSON.parse(xmlhttp.responseText);
            callback(result, path);
        }
    }
    xmlhttp.open("GET", path, true);
    xmlhttp.send();
}

var loadAnimations = function(){
    loadJsons([ "animations/carreQuiTourne.json",
                "animations/copieBordSud.json",
                "animations/copieBordNord.json",
                "animations/copieBordOuest.json",
                "animations/copieBordNordOuest.json",
                "animations/copieBordSudEst.json"],function(results){
        init(results);
    });
}

var addAnimationToCell = function(cell, animation){
    addDrawToCell(cell, animation.draw);
    addSetupToCell(cell, animation.setup);

};

var init = function (jsons) {


    var jsonAnimations = [[jsons.copieBordSudEst, jsons.copieBordSud, jsons.copieBordOuest],
                          [jsons.copieBordSudEst, jsons.carreQuiTourne, jsons.copieBordOuest],
                          [jsons.carreQuiTourne, jsons.copieBordNordOuest, jsons.copieBordNord]];

    

    var cells = map2dArray(jsonAnimations,function(jsonAnim,row,col){
        var canvas = makeCanvas("canvas-" + row + "-" + col); 
        var context = canvas.getContext("2d");
        return  makeCell(context, jsonAnim);
    });


   

    var textAreaSetup = document.getElementById("text_area_setup"),
        textAreaDraw = document.getElementById("text_area_draw");

    textAreaDraw.className = "code_valid";
    textAreaSetup.className = "code_valid";

    textAreaSetup.onkeyup = function(){
        var targetCell = cells[1][1];     

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
        var targetCell = cells[1][1];
    
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

window.onload = loadAnimations;
