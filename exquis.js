"use strict";


var init = function () {


    var CanvasLeft = function(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.rotation = 0;

        var halfWidth = this.canvas.width / 2;
        var halfHeight = this.canvas.height / 2;

        this.draw = function(){
    
            this.ctx.fillStyle = "rgb(0,0,0)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
        
            this.ctx.save();
            this.ctx.translate(halfWidth, halfHeight);
            this.ctx.scale(3, 3);
            this.ctx.rotate(toRadians(this.rotation));

            this.rotation = (this.rotation + 1) % 360;
            

            this.ctx.fillStyle = "rgb(200,0,0)";
            this.ctx.fillRect(-25, -25, 50, 50);


            this.ctx.restore();

            // image data
            var imageDataForTopLine = this.ctx.getImageData(0, 0, this.canvas.width, 1);
            return imageDataForTopLine;

        };
    };



    var canvasLeft = new CanvasLeft(document.getElementById('canvas_left')),
        canvasRight = document.getElementById('canvas_right');


    var ctxRight = canvasRight.getContext('2d');


    var rotation = 0;

    var toRadians = function(degrees){
        return  degrees * Math.PI / 180; 
    };


   var draw = function(){
        var imageDataForTopLine = canvasLeft.draw();
        draw_right(imageDataForTopLine);
    };

   var draw_right = function(pixel_data){
        
        // paste current image one pixel down
        var currentImage = ctxRight.getImageData(0, 0, canvasRight.width, canvasRight.height);
        ctxRight.putImageData(currentImage, 0, 1);

        // add new line on the top 

        ctxRight.putImageData(pixel_data, 0, 0);

    };


    setInterval(draw, 50);
    //draw();

};

window.onload = init;


