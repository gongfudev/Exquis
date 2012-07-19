"use strict";

// Version 2
 var animationDefinitionLiterale = function(){
    var myPrivateStuff = SOMEVALUE,
        myEvenMorePrivateStuff = SOMEVALUE;

    return {
        init: function( canvas) {
        },
        draw: function( borders) {
            throw ("redefine me");
        },
        canvas: self.canvas
    }
 }

// Version 1 -- avec dépendance sur une "classe" Animation

var animation_1 = Animation();
animation_1.toRadians = function(degrees){
    return  degrees * Math.PI / 180; 
};

animation_1.setup = function(){
    this.rotation = 0;
    this.halfWidth = this.canvas.width / 2;
    this.halfHeight = this.canvas.height / 2;
}

animation_1.draw = function(borders){

        this.context.fillStyle = "rgb(0,0,0)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
    
        this.context.save();
        this.context.translate(halfWidth, halfHeight);
        this.context.scale(3, 3);
        this.context.rotate(this.toRadians(this.rotation));

        this.rotation = (this.rotation + 1) % 360;
        

        this.context.fillStyle = "rgb(200,0,0)";
        this.context.fillRect(-25, -25, 50, 50);


        this.context.restore();

        // image data
        var imageDataForTopLine = this.context.getImageData(0, 0, this.canvas.width, 1);
        return imageDataForTopLine;

};

//exquis.addToDashboard( animation_1);

// FIXME: move this call to the Dashboard
var canvas = TODO;
animation_1.init( canvas);
  

var init = function () {



    var canvasLeft = new CanvasLeft(document.getElementById('canvas_left')),
        canvasRight = document.getElementById('canvas_right');


    var contextRight = canvasRight.getContext('2d');


    var rotation = 0;




   var draw = function(){
        var imageDataForTopLine = canvasLeft.draw();
        draw_right(imageDataForTopLine);
    };

   var draw_right = function(pixel_data){
        
        // paste current image one pixel down
        var currentImage = contextRight.getImageData(0, 0, canvasRight.width, canvasRight.height);
        contextRight.putImageData(currentImage, 0, 1);

        // add new line on the top 

        contextRight.putImageData(pixel_data, 0, 0);

    };


    setInterval(draw, 50);
    //draw();

};

window.onload = init;


