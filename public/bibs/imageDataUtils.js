define({
      vec2d: function(x, y){
          return {x: x, y: y};
      },
      vec2dAdd:function(a, b){
          return this.vec2d(a.x + b.x, a.y + b.y);
      },
      vec2dSubstract:function(a, b){
          return this.vec2d(a.x - b.x, a.y - b.y);
      },
      rotateVec90cw: function(vec){
          return { x: -vec.y, y: vec.x };
      },
      rotateVec90ccw: function(vec){
          return { x: vec.y, y: -vec.x };
      },
      rectangularPixelFlow: function(startPnt,
                                     breadth,
                                     depth,
                                     directionVec)
     {
         var that = this,
             perpDirection = that.rotateVec90cw(directionVec),
             copyDirection = that.vec2d(-directionVec.x, -directionVec.y),
             deltaBreadth = that.vec2d(perpDirection.x * breadth,
                                       perpDirection.y * breadth),
             deltaDepth = that.vec2d(directionVec.x * depth,
                                     directionVec.y * depth),
             secondPnt = that.vec2dSubstract(startPnt, deltaDepth),
             thirdPnt = that.vec2dAdd(startPnt, deltaBreadth);

         var rectCorners = [that.vec2d(Math.min(secondPnt.x, thirdPnt.x),
                                       Math.min(secondPnt.y, thirdPnt.y)),
                            that.vec2d(Math.max(secondPnt.x, thirdPnt.x),
                                       Math.max(secondPnt.y, thirdPnt.y))];
         var fromRectangle = {x: rectCorners[0].x,
                              y:  rectCorners[0].y,
                              width: rectCorners[1].x - rectCorners[0].x,
                              height: rectCorners[1].y - rectCorners[0].y};
         var toPoint = {x: fromRectangle.x + copyDirection.x,
                        y: fromRectangle.y + copyDirection.y};
         return {fromRectangle: fromRectangle, toPoint: toPoint};
         //imageDataUtils.copyContextPixels(context, fromRectangle, toPoint);
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
        avgArray = totals.map(function(total){ return Math.round(total/pixels.length*4);});
        avgArray[3] = 1;
        return avgArray;
    },

    // TODO: fix for vertical 
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
    }
});
