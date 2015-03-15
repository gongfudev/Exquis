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
    vec2dScale: function(vec, scale){
        return this.vec2d(vec.x * scale, vec.y *scale);
    },
    vec2dAddScaled: function(vec, vecToScale, scale){
        var scaled = this.vec2dScale(vecToScale, scale);
        return this.vec2dAdd(vec, scaled);
    },
    rectangle: function(x, y, width, height){
        return {x: x, y: y, width: width, height: height} ;
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
    pixelTranslateParams: function(rectangle, horizontal, speed){
        var dirs = this.copyDirections,
            paralDirection = horizontal ? dirs.east : dirs.south,
            perpDirection = horizontal ? dirs.south : dirs.east,
            paralSize = horizontal ? rectangle.width : rectangle.height,
            perpSize =  horizontal ? rectangle.height : rectangle.width,
            changeSize = Math.abs(speed),
            copySize = paralSize - changeSize,
            /*
             horizontal example:
             
             changeSize  ----           
             copySize    ---------------
                         x----x----------x----
                  point0 |  point1     point2 |
                         |                    |
                         |                    |
                         |  point3     point4 | point5
                          ----x-----------x---x 
             */
            point0 = this.vec2d(rectangle.x, rectangle.y),
            point1 = this.vec2dAddScaled(point0, paralDirection, changeSize),
            point2 = this.vec2dAddScaled(point0, paralDirection, copySize),
            point3 = this.vec2dAddScaled(point1, perpDirection, perpSize),
            point4 = this.vec2dAddScaled(point2, perpDirection, perpSize),
            point5 = this.vec2dAddScaled(point4, paralDirection, changeSize),

            changePointA = point0,
            changePointB = point3,
            copyPointA   = point0,
            copyPointB   = point4,
            pastePoint   = point1;
        if(speed < 0){
            changePointA = point2;
            changePointB = point5;
            copyPointA   = point1;
            copyPointB   = point5;
            pastePoint   = point0;
        }
        return {changeRectangle: {x: changePointA.x,
                                  y: changePointA.y,
                                  width: changePointB.x - changePointA.x,
                                  height: changePointB.y - changePointA.y},
                copyRectangle: {x: copyPointA.x,
                                y: copyPointA.y,
                                width: copyPointB.x - copyPointA.x,
                                height: copyPointB.y - copyPointA.y},
                pastePoint: pastePoint};
    },
    /* return average color in form [r, g, b, 1] */
    averageColor: function(imageData){
        var pixels = imageData.data,
            totals = [0,0,0],
            avgArray;
        for(var i = 0; i < pixels.length; i += 4){
            for(var j = 0; j < 3; j++){
                totals[j] += pixels[i + j];
            }
        }
        avgArray = totals.map(function(total){
            return Math.round(total/pixels.length * 4);
        });
        avgArray[3] = 255;
        return avgArray;
    },
    array2CSSColor: function(colorArray){
        var alpha = colorArray.length < 4 ? 1 : colorArray[3];
        return "rgba(" + colorArray[0] + "," + colorArray[1] + ","
            + colorArray[2] + "," + alpha + ")";
    },
    avgColorFilter: function(context, imageData){
        var avgColor = this.averageColor(imageData),
            result = context.createImageData(imageData);
        for(var i = 0; i < imageData.data.length; i += 4){
            result.data.set(avgColor, i);
        }
        return result;
    },
    sliceImageData: function(context, imageData, start, length){
        var horizontal = imageData.height == 1,
            startIndex = start * 4,
            endIndex = (start + length) * 4, 
            slicedData = imageData.data.subarray(startIndex, endIndex),
            result;
        if(horizontal){
            result = context.createImageData(length, 1);
        }else{
            result = context.createImageData(1, length);
        }
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
    drawFlow: function(context, srcPixels, rectangle, horiz, speed, filter){
        var opts = this.pixelTranslateParams(rectangle, horiz, speed),
            pixels = srcPixels;
        if(filter){
            pixels = filter.call(this, context, srcPixels); 
        }
        this.drawPixels(context, opts.changeRectangle, pixels, horiz);
        this.copyContextPixels(context, opts.copyRectangle, opts.pastePoint);
    },
    drawAvgFlow: function(context, srcPixels, rectangle, horizontal, speed){
        this.drawFlow(context, srcPixels, rectangle, horizontal, speed,
                      this.avgColorFilter);
    },
    drawPixels: function(context, chgRec, srcPixels, horizontal){
        var size = horizontal ? chgRec.width : chgRec.height,
            d= [0,0];
        for(var i=0; i<size; i++){
            d[horizontal? 0 : 1] = i;
            context.putImageData(srcPixels, chgRec.x + d[0], chgRec.y + d[1]);
        }
    }
});
