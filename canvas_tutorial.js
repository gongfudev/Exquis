


var init = function () {






    var clear = function(canvas)
    {
        var context = canvas.getContext("2d");
        // Store the current transformation matrix
        context.save();

        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        context.restore();
    }

    var CanvasLeft = function(canvas)
    {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.rotation = 0;

        var halfWidth = this.canvas.width / 2;
        var halfHeight = this.canvas.height / 2;

        this.draw = function()
        {
            clear(this.canvas);

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

        }
    }




    var BufferOfLines = function(maxLines)
    {
        this.maxLines = maxLines;
        this.lines = [];


        this.push = function(newLine){
            this.lines.push(newLine);
        
            if (this.lines.length >= maxLines)
            {
                this.lines.shift();
            }
        };
    }

    var canvasLeft = new CanvasLeft(document.getElementById('canvas_left')),
        canvasRight = document.getElementById('canvas_right');


    var ctxRight = canvasRight.getContext('2d');

    var bufferOfLines = new BufferOfLines(canvasRight.height);

    var rotation = 0;



    var toRadians = function(degrees)
    {
        return  degrees * Math.PI / 180; 
    }

    // var draw_left = function()
    // {

    //     clear(canvasLeft);

    //     ctxLeft.fillStyle = "rgb(0,0,0)";
    //     ctxLeft.fillRect(0, 0, canvasLeft.width, canvasLeft.height);
        
    
    //     ctxLeft.save();
    //     ctxLeft.translate(halfWidth, halfHeight);
    //     ctxLeft.scale(3, 3);
    //     ctxLeft.rotate(toRadians(rotation));

    //     rotation = (rotation + 1) % 360;

    //     ctxLeft.fillStyle = "rgb(200,0,0)";
    //     ctxLeft.fillRect(-25, -25, 50, 50);


    //     ctxLeft.restore();

    //     // image data
    //     var imageDataForTopLine = ctxLeft.getImageData(0, 0, canvasLeft.width, 1);
    //     return imageDataForTopLine;
    // }


   var draw = function()
    {
        var imageDataForTopLine = canvasLeft.draw();
        draw_right(imageDataForTopLine.data);
    }

   var draw_right = function(pixel_data)
    {
       bufferOfLines.push(pixel_data);
 
        //console.log("pix color" + bufferOfLines.lines.length);

        var rightImageData = ctxRight.createImageData(canvasRight.width, canvasRight.height);


        for (var i = 0; i < bufferOfLines.lines.length; i++) {
            nextLine = bufferOfLines.lines[i];

            for (var j = 0; j < nextLine.length; j++) {
                rightImageData.data[(i * nextLine.length) + j] = nextLine[j];
            };
        };



        ctxRight.putImageData(rightImageData, 0, 0);

    }


    setInterval(draw, 50);
    //draw();

}

window.onload = init;


