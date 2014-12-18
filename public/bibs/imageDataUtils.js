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
                                   directionVec,
                                   breadth,
                                   depth,
                                   copyDepth)
    {

/*
Input: 
      --> directionVec

                     copyDepth
                      ----- 
      ---------------------o startPoint             
           depth           |            
                           |           
                   breadth |          
                           |

Internal representation:

      | perpDirection
      v 

      <-- copyDirection
                  
  secondPnt
  toPoint    recStart
      o-----o---------------
       -----               |
      copyDepth            |
                           |
                           o thirdPnt
                             recEnd

Output:

  toPoint   fromRectangle
      o   o-----------------
               width       |
                           |
                    height |
                           |

*/
        var that = this,
            perpDirection = that.rotateVec90cw(directionVec),
            copyDirection = that.vec2d(-directionVec.x, -directionVec.y),
            deltaBreadth = that.vec2d(perpDirection.x * breadth,
                                      perpDirection.y * breadth),
            deltaDepth = that.vec2d(directionVec.x * depth,
                                    directionVec.y * depth),
            secondPnt = that.vec2dSubstract(startPnt, deltaDepth),
            thirdPnt = that.vec2dAdd(startPnt, deltaBreadth),
            toPoint = that.vec2d(Math.min(secondPnt.x, thirdPnt.x),
                                 Math.min(secondPnt.y, thirdPnt.y)),
            copyDepth = copyDepth ? copyDepth : 1,
            deltaCopy = that.vec2d(copyDirection.x * copyDepth,
                                   copyDirection.y * copyDepth),
            recStart = that.vec2dSubstract(toPoint, deltaCopy),
            recEnd = that.vec2d(Math.max(secondPnt.x, thirdPnt.x),
                                Math.max(secondPnt.y, thirdPnt.y)),
            fromRectangle = {x: recStart.x,
                             y: recStart.y,
                             width: recEnd.x - recStart.x,
                             height: recEnd.y - recStart.y};
        return {fromRectangle: fromRectangle, toPoint: toPoint};
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
