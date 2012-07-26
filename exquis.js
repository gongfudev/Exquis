"use strict";

var makeAnimationLeft = function(context){
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


var makeAnimationRight = function(context){
    return {
        draw: function(borders) {
            // paste current image one pixel down
            var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            context.putImageData(currentImage, 1, 0);

            // add new line on the top 
            context.putImageData(borders.west, 0, 0);
        }
    }
 };

var makeAnimationBottom = function(context){
    return {
        draw: function(borders) {
            // paste current image one pixel down
            var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            context.putImageData(currentImage, 0, 1);

            // add new line on the top 
            context.putImageData(borders.north, 0, 0);
        }
    }
 };

var init = function () {

    //animationLeft.init(document.getElementById('canvas_left'));
    var contextTL = document.getElementById('canvas_top_left').getContext("2d"),
        contextTR = document.getElementById('canvas_top_right').getContext("2d"),
        contextBL = document.getElementById('canvas_bottom_left').getContext("2d"),
        contextBR = document.getElementById('canvas_bottom_right').getContext("2d");
    var animationTL = makeAnimationLeft(contextTL),
        animationTR = makeAnimationRight(contextTR),
        animationBL = makeAnimationBottom(contextBL),
        animationBR = makeAnimationRight(contextBR);

    var draw = function(){
        var bordersTL = {
            north: contextTL.getImageData(0, 0, contextTL.canvas.width, 1),
            south: contextTL.getImageData(0, contextTL.canvas.height-1, contextTL.canvas.width, 1),
            east: contextTL.getImageData(contextTL.canvas.width-1, 0, 1 , contextTL.canvas.height)
        };
        var bordersBL = {east: contextBL.getImageData(contextBL.canvas.width-1, 0, 1, contextBL.canvas.height)};
        animationTL.draw();
        animationTR.draw({west: bordersTL.east});
        animationBL.draw({north: bordersTL.south});
        animationBR.draw({west: bordersBL.east});
    };


    setInterval(draw, 50);
    //draw();

};

window.onload = init;


