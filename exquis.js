"use strict";

var makeCanvas = function(id){
    var canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = 150;
    canvas.height = 150;

    document.getElementById('dashboard').appendChild(canvas);
    return canvas;
}


// ids of type "canvas-row-col"
var makeGrid = function(){
   var result = [];

    for (var row = 0; row < 3; row++) {
        result.push([]);

        for (var col = 0; col < 3; col++) {
            var canvasId = "canvas-" + row + "-" + col;
            result[row].push(makeCanvas(canvasId)); 
        }
    };
    return result ;
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
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
            func(array2d[row][col], row, col);
        };
    };
};


var makeCell = function(context, mkAnimation){
    return {
        animation : mkAnimation(context),
        borders : function(){
            return {
                    north: context.getImageData(0, 0, context.canvas.width, 1),
                    south: context.getImageData(0, context.canvas.height - 1, context.canvas.width, 1),
                    east: context.getImageData(context.canvas.width - 1, 0, 1 , context.canvas.height),
                    west: context.getImageData(0, 0, 1, context.canvas.height - 1)
                };
        },
        draw : function(borders){ this.animation.draw(borders);}
    };

}

var makeCubeAnimation = function(context){
    var toRadians = function(degrees){
        return  degrees * Math.PI / 180; 
    };
    var rotation = 0,
        halfWidth = context.canvas.width / 2,
        halfHeight = context.canvas.height / 2;

    return {
        draw: function(borders) {
            context.fillStyle = "rgb(0,0,0)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            context.save();
            context.translate(halfWidth, halfHeight);
            context.scale(3, 3);
            context.rotate(toRadians(rotation));

            rotation = (rotation + 1) % 360;

            context.fillStyle = "rgb(200,0,0)";
            context.fillRect(-25, -25, 50, 50);

            context.restore();
        }
    }
 };


var makeSideCopyAnimation = function(context, side){
    var imageCopyOrigin = { west: {x:1, y:0}, 
                            east: {x:-1, y:0},
                           north: {x:0, y:1},
                           south: {x:0, y:-1} };
    var borderOrigin = { west: {x:0, y:0}, 
                            east: {x:context.canvas.width - 1, y:0},
                           north: {x:0, y:0},
                           south: {x:0, y:context.canvas.height - 1} };


    
    return {
        draw: function(borders){
            // paste current image one pixel down
            var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            var origin = imageCopyOrigin[side];
            context.putImageData(currentImage, origin.x, origin.y);
            // add new line
            var borderO = borderOrigin[side];
            context.putImageData(borders[side], borderO.x, borderO.y);
        }

    };
};

var chainAnimations = function(animations){
    return{
        draw: function(borders) {
           animations.forEach(function(animation){ 
                                animation.draw(borders);
                              });
        }
    }
}

var chainSideCopyAnimations = function (context, sides) {
    var animations = sides.map(function(side){ 
            return makeSideCopyAnimation(context, side);
            });
    return chainAnimations(animations);
}

var mkAnimationTL = function(context){return chainSideCopyAnimations(context, ['south', 'east']);},
    mkAnimationTM = function(context){return  makeSideCopyAnimation(context,'south');}, 
        mkAnimationTR = function(context){return  makeSideCopyAnimation(context,'west');}, 
        mkAnimationML = function(context){return   chainSideCopyAnimations(context,['south', 'east']);},
        mkAnimationMM = function(context){return  makeCubeAnimation(context);},
        mkAnimationMR = function(context){return  makeSideCopyAnimation(context,'west');}, 
        mkAnimationBL = function(context){return  makeCubeAnimation(context);},
        mkAnimationBM = function(context){return  chainSideCopyAnimations(context,['west', 'north']);},
        mkAnimationBR = function(context){return  makeSideCopyAnimation(context,'north');};

var relativeCoordinates = {
    north : {row: -1, col: 0, opposite: "south"},
    south : {row: 1, col: 0, opposite: "north"},
    west : {row: 0, col: -1, opposite: "east"},
    east : {row: 0, col: 1, opposite: "west"}
};

var init = function () {
    var gridOfCanvases = makeGrid();

    var mkAnimationsDefinitions = [[mkAnimationTL, mkAnimationTM, mkAnimationTR],
                                    [mkAnimationML, mkAnimationMM, mkAnimationMR],
                                    [mkAnimationBL, mkAnimationBM, mkAnimationBR]];

    var cells = map2dArray(gridOfCanvases,function(canvas,row,col){
        var context = canvas.getContext("2d");
        return  makeCell(context, mkAnimationsDefinitions[row][col]);
    });


    var draw = function(){

        var allBorders = map2dArray(cells,function(cell){ 
            return cell.borders();
        });

        forEach2dArray(cells,function(cell, col, row){
            var neighbouringBorders = {};
            ["north", "south", "east", "west"].forEach(function(side){
                var offset = relativeCoordinates[side];
                var siderow = (row + offset.row + cells.length) % cells.length;
                var sidecol = (col + offset.col + cells[0].length) % cells[0].length;
                neighbouringBorders[side] = allBorders[siderow][sidecol][offset.opposite];
    
            });
            

            cell.draw(neighbouringBorders);
        });
    };


    setInterval(draw, 50);

};

window.onload = init;