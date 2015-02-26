define({
    copyDirections : {
        north: {x:0, y:-1},
        east:  {x:1, y:0},
        south: {x:0, y:1},
        west:  {x:-1, y:0}
    },
    vec2d: function(x, y){
        return {x: x, y: y};
    },
    vec2dAdd:function(a, b){
        return this.vec2d(a.x + b.x, a.y + b.y);
    },
    vec2dSubstract:function(a, b){
        return this.vec2d(a.x - b.x, a.y - b.y);
    },
    vec2dScale: function(vec, scale){
        return this.vec2d(vec.x * scale, vec.y *scale);
    },
    vec2dAddScaled: function(vec, vecToScale, scale){
        var scaled = this.vec2dScale(vecToScale, scale);
        return this.vec2dAdd(vec, scaled);
    },
    /** 
     Input:

       rectangle: 
         x--------------------
         |                    |
         |                    |
         |                    |
          --------------------

       horizontal: true
       speed: 4

     Output:

       out.changeRectangle
         x----
         |    |
         |    |
         |    |
          ---- 


       out.copyRectangle: 
         x---------------
         |               |
         |               |
         |               |
          ---------------

       out.toPoint
              x 

     */
    pixelFlowParams: function(rectangle, horizontal, speed){

        var cardinalDirection = horizontal ? "east" : "south",
            parallDim = horizontal ? "width" : "height",
            perpenDim = horizontal ? "height" :  "width",
            changeSize = Math.abs(speed),
            copySize = rectangle[parallDim] - changeSize,
            copyDirection = this.copyDirections[cardinalDirection],
            point0 = this.vec2d(rectangle.x, rectangle.y),
            point1 = this.vec2dAddScaled(point0, copyDirection, changeSize),
            point2 = this.vec2dAddScaled(point0, copyDirection, copySize),
         /*
          horizontal example:

          changeSize  ----           
            copySize  ---------------
                     x----x----------x----
              point0 |  point1     point2 |
                     |                    |
                     |                    |
                     |                    |
                      --------------------
         */
            copyPoint   = speed > 0 ? point0 : point1,
            changePoint = speed > 0 ? point0 : point2,
            pastePoint  = speed > 0 ? point1 : point0,
            changeRectangle = {x: changePoint.x, y: changePoint.y},
            copyRectangle = {x: copyPoint.x, y: copyPoint.y};
        changeRectangle[parallDim] = changeSize;
        changeRectangle[perpenDim] = rectangle[perpenDim];
        copyRectangle[parallDim] = copySize;
        copyRectangle[perpenDim] = rectangle[perpenDim];
        return {changeRectangle: changeRectangle,
                copyRectangle: copyRectangle,
                pastePoint: pastePoint};
    },
    // return average color in form [r, g, b, 1]
    averageColor: function(imageData){
        var pixels = imageData.data,
            totals = [0,0,0],
            avgArray;
        
        for(var i = 0; i < pixels.length; i += 4){
            totals[0] += pixels[i];
            totals[1] += pixels[i+1];
            totals[2] += pixels[i+2];
        }
        avgArray = totals.map(function(total){
            return Math.round(total/pixels.length*4);
        });
        avgArray[3] = 1;
        return avgArray;
    },
    sliceImageData: function(context, imageData, start, length){
        var horizontal = imageData.height == 1,
            startIndex = start * 4,
            endIndex = (start + length) * 4, 
            result = horizontal ? context.createImageData(length, 1) : context.createImageData(1, length),
            slicedData = imageData.data.subarray(startIndex, endIndex);
        result.data.set(slicedData);
        return result;
    },
    copyContextPixels: function(context, fromRectangle, toPoint){
        var currentImage = context.getImageData(fromRectangle.x, 
                                                  fromRectangle.y, 
                                                  fromRectangle.width, 
                                                  fromRectangle.height);
          context.putImageData(currentImage, toPoint.x, toPoint.y);
    },
    array2CSSColor: function(colorArray){
        var alpha = colorArray.length < 4 ? 1 : colorArray[3];
        return "rgba(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + "," + alpha + ")";
    },
    rectangle: function(x, y, width, height){
        //TODO replace width and height with x,y of opposite point
        return {x: x, y: y, width: width, height: height} ;
    },
    drawFlow: function(context, srcPixels, rectangle, horizontal, speed){
        var opts = this.pixelFlowParams(rectangle, horizontal, speed); 
        this.drawPixels(context, opts.changeRectangle, srcPixels, horizontal);
        this.copyContextPixels(context, opts.copyRectangle, opts.pastePoint);
    },
    drawPixels: function(context, chgRec, srcPixels, horizontal){
        var size = horizontal ? chgRec.width : chgRec.height,
            d= [0,0];
        for(var i=0; i<size; i++){
            d[horizontal? 0 : 1] = i;
            context.putImageData(srcPixels, chgRec.x + d[0], chgRec.y + d[1]);
        }
    },
    drawAvgFlow: function(context, srcPixels, rectangle, horizontal, speed){
        var opts = this.pixelFlowParams(rectangle, horizontal, speed); 
        //TODO write an avg function to transfom the srcPixels
        // and draw them with drawPixels
        this.drawAvgColor(context, opts.changeRectangle, srcPixels);
        this.copyContextPixels(context, opts.copyRectangle, opts.pastePoint);
    },
    drawAvgColor: function(context, chgRec, srcPixels){
        var color = this.averageColor(srcPixels);
        context.fillStyle = this.array2CSSColor(color);
        context.fillRect(chgRec.x, chgRec.y, chgRec.width, chgRec.height);
    }
});
