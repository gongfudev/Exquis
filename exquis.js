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


var makeCell = function(context, mkAnimation){
    return {
        animation : mkAnimation ? mkAnimation() : {},
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

}


var squareAnimation = {
        setup: function(context){
            this.toRadians = function(degrees){
                return  degrees * Math.PI / 180; 
            };
            this.rotation = 0;
            this.halfWidth = context.canvas.width / 2;
            this.halfHeight = context.canvas.height / 2;
        },
        draw: function(context,borders) {
            context.fillStyle = "rgb(0,0,0)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            context.save();
            context.translate(this.halfWidth, this.halfHeight);
            context.scale(3, 3);
            context.rotate(this.toRadians(this.rotation));

            this.rotation = (this.rotation + 1) % 360;

            context.fillStyle = "rgb(200,0,0)";
            context.fillRect(-25, -25, 50, 50);

            context.restore();
        }
 };

var makeSideCopyAnimation = function(side){

    return {
        setup: function(context){
            this.imageCopyOrigin = { west: {x:1, y:0}, 
                                    east: {x:-1, y:0},
                                   north: {x:0, y:1},
                                   south: {x:0, y:-1} };
            this.borderOrigin = { west: {x:0, y:0}, 
                                    east: {x:context.canvas.width - 1, y:0},
                                   north: {x:0, y:0},
                                   south: {x:0, y:context.canvas.height - 1} };

        },
        draw: function(context, borders){
            // paste current image one pixel down
            var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            var origin = this.imageCopyOrigin[side];
            context.putImageData(currentImage, origin.x, origin.y);
            // add new line
            var borderO = this.borderOrigin[side];
            context.putImageData(borders[side], borderO.x, borderO.y);
        }

    };
};

var chainAnimations = function(animations){
    return{
        setup: function(context){
           animations.forEach(function(animation){ 
                    animation.setup(context);
                  });
        },
        draw: function(context, borders) {
           animations.forEach(function(animation){ 
                                animation.draw(context, borders);
                              });
        }
    }
}

var chainSideCopyAnimations = function (sides) {
    var animations = sides.map(function(side){ 
            return makeSideCopyAnimation(side);
            });
    return chainAnimations(animations);
}

var mkAnimationTL = function(context){return chainSideCopyAnimations( ['south', 'east']);},
    mkAnimationTM = function(context){return  makeSideCopyAnimation('south');}, 
    mkAnimationTR = function(context){return  makeSideCopyAnimation('west');}, 
    mkAnimationML = function(context){return  chainSideCopyAnimations(['south', 'east']);},
    mkAnimationMM = function(context){return  makeSquareAnim();},
    mkAnimationMR = function(context){return  makeSideCopyAnimation('west');}, 
    mkAnimationBL = function(context){return  squareAnimation;},
    mkAnimationBM = function(context){return  chainSideCopyAnimations(['west', 'north']);},
    mkAnimationBR = function(context){return  makeSideCopyAnimation('north');};

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

// jsons -> [ path ]
var loadJsons = function(jsons, callback ){

    var results = [];
    var loadNextJson = function(result){
            results.push(result);

            if (jsons.length > 0){
                loadJson(jsons.shift(),loadNextJson);
            }else{
                callback(results);
            }
               
    } 
    loadJson(jsons.shift(), loadNextJson);

}

var loadJsonsAsync = function(jsons, callback ){

    var results = [];
    var handleJson = function(result){
            results.push(result);
            if (results.length == jsons.length ){
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
            callback(result);
        }
    }
    xmlhttp.open("GET", path, true);
    xmlhttp.send();
}

var loadAnimations = function(){
    loadJsons([ "animations/carreQuiTourne.json"],function(results){
        init(results[0]);
    });
}

var init = function (cqt) {
    var mkAnimationsDefinitions = [[mkAnimationTL, mkAnimationTM, mkAnimationTR],
                                   [mkAnimationML, 0, mkAnimationMR],
                                   [mkAnimationBL, mkAnimationBM, mkAnimationBR]];

    var cells = map2dArray(mkAnimationsDefinitions,function(mkAnimDef,row,col){
        var canvas = makeCanvas("canvas-" + row + "-" + col); 
        var context = canvas.getContext("2d");
        return  makeCell(context, mkAnimDef);
    });

    addDrawToCell(cells[1][1], cqt.draw);
    addSetupToCell(cells[1][1], cqt.setup);

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
