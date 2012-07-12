


var init = function () {

    var canvasLeft = document.getElementById('canvas_left');
    var canvasRight = document.getElementById('canvas_right');

    var ctxLeft = canvasLeft.getContext('2d');
    var ctxRight = canvasRight.getContext('2d');


    var halfWidth = canvasLeft.width / 2;
    var halfHeight = canvasLeft.height / 2;

    var bufferOfLines = [];

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

    bufferOfLines = new BufferOfLines(canvasRight.height);

    var rotation = 0;

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

    var toRadians = function(degrees)
    {
        return  degrees * Math.PI / 180; 
    }

    var draw_left = function()
    {

        clear(canvasLeft);

        ctxLeft.fillStyle = "rgb(0,0,0)";
        ctxLeft.fillRect(0, 0, canvasLeft.width, canvasLeft.height);
        
    
        ctxLeft.save();
        ctxLeft.translate(halfWidth, halfHeight);
        ctxLeft.scale(3, 3);
        ctxLeft.rotate(toRadians(rotation));

        rotation = (rotation + 1) % 360;

        ctxLeft.fillStyle = "rgb(200,0,0)";
        ctxLeft.fillRect(-25, -25, 50, 50);


        ctxLeft.restore();

        // image data
        var imageDataForTopLine = ctxLeft.getImageData(0, 0, canvasLeft.width, 1);
        return imageDataForTopLine;
    }

   var draw = function()
    {
        var imageDataForTopLine = draw_left();
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


        console.log(rightImageData.data.length);

    }


    setInterval(draw, 50);
    //draw();

}

window.onload = init;


