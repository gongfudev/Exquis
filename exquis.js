"use strict";

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

var makeBordersForContext = function(context){
    return {
            north: context.getImageData(0, 0, context.canvas.width, 1),
            south: context.getImageData(0, context.canvas.height - 1, context.canvas.width, 1),
            east: context.getImageData(context.canvas.width - 1, 0, 1 , context.canvas.height),
            west: context.getImageData(0, 0, 1, context.canvas.height - 1)
        };
}

var init = function () {

    //animationLeft.init(document.getElementById('canvas_left'));
    var contextTL = document.getElementById('canvas_top_left').getContext("2d"),
        contextTM = document.getElementById('canvas_top_middle').getContext("2d"),
        contextTR = document.getElementById('canvas_top_right').getContext("2d"),
        contextML = document.getElementById('canvas_middle_left').getContext("2d"),
        contextMM = document.getElementById('canvas_middle_middle').getContext("2d"),
        contextMR = document.getElementById('canvas_middle_right').getContext("2d"),
        contextBL = document.getElementById('canvas_bottom_left').getContext("2d"),
        contextBM = document.getElementById('canvas_bottom_middle').getContext("2d"),
        contextBR = document.getElementById('canvas_bottom_right').getContext("2d");
    var animationTL = chainSideCopyAnimations(contextTL, ['south', 'east']),
        animationTM = makeSideCopyAnimation(contextTM,'south'), 
        animationTR = makeSideCopyAnimation(contextTR,'west'), 
        animationML =  chainSideCopyAnimations(contextML,['south', 'east']),
        animationMM = makeCubeAnimation(contextMM),
        animationMR = makeSideCopyAnimation(contextMR,'west'), 
        animationBL = makeCubeAnimation(contextBL),
        animationBM = chainSideCopyAnimations(contextBM,['west', 'north']),
        animationBR = makeSideCopyAnimation(contextBR,'west');

    var mainDraw = function(){

        var bordersMM = makeBordersForContext(contextMM),
            bordersBM = makeBordersForContext(contextBM), //{east: contextBM.getImageData(contextBM.canvas.width-1, 0, 1, contextBM.canvas.height)};
            bordersBL = makeBordersForContext(contextBL),
            bordersML = makeBordersForContext(contextML),
            bordersTM = makeBordersForContext(contextTM);
        
        var inputBM = {west: bordersMM.east,
                       north: bordersMM.south};
        var inputML = {
                        east: bordersMM.west,
                        south: bordersBL.north
                        };

        var inputTL = {
                        south: bordersML.north,
                        east: bordersTM.west
                        };

        animationTL.draw(inputTL);
        animationTR.draw({ west: bordersTM.east });
        animationML.draw(inputML);                        
        animationMM.draw();
        animationMR.draw({west: bordersMM.east});
        animationBL.draw();
        animationBM.draw(inputBM);
        animationBR.draw({west: bordersBM.east});
        animationTM.draw({south: bordersMM.north});

        window.requestNextAnimationFrame(mainDraw);

    };


    window.requestNextAnimationFrame(mainDraw);

};

window.onload = init;


// makeAnimationBottom(contextBM),// makeAnimationBottom(contextBM),