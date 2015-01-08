define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      draw: function (context, borders){
          var copyDirections = {
              north: {x:0, y:-1},
              east:  {x:1, y:0},
              south: {x:0, y:1},
              west:  {x:-1, y:0}
          },
              cardinalDirection = "east",
              maxDepth = context.canvas.height, 
              maxBreadth = context.canvas.width,
              directionVec = copyDirections[cardinalDirection];
          if(directionVec.y){ //vertical flow
              maxDepth = context.canvas.height;
              maxBreadth = context.canvas.height;
          }
          var depth = maxDepth - 10, //margin
              breadthStart = 100,
              breadth = maxBreadth - breadthStart,
              speed = 5; 

          
          
          var center = idu.vec2d(context.canvas.width / 2, 
                                 context.canvas.height /2 ),
              centerToSide = idu.scaleVec(directionVec, maxDepth/2),
              ccwPerp = idu.rotateVec90ccw(directionVec),
              sideToStart = idu.scaleVec(ccwPerp, maxBreadth/2 - breadthStart),
              centerToStart = idu.vec2dAdd(centerToSide, sideToStart),
              startPoint = idu.vec2dAdd(center, centerToStart);

          var source = borders[cardinalDirection];
          //TODO breadthStart should be 0 for south...

          var pixelBreadthStart = breadthStart;
          if (cardinalDirection == "south" || cardinalDirection == "west"){
              pixelBreadthStart = 0;
          }

          var sourcePixels = idu.sliceImageData(context, source, 
                                                pixelBreadthStart, breadth);
          var avgColorArray = idu.averageColor(sourcePixels);
          var lineColor = idu.array2CSSColor(avgColorArray);
          context.fillStyle = lineColor;
          
          var copyDirection = idu.vec2d(-directionVec.x, -directionVec.y);
          var copyR = idu.makeRectangle(startPoint, 
                                        copyDirection, 
                                        breadth, 
                                        speed);
          context.fillRect(copyR.x, copyR.y, copyR.width, copyR.height);
          
          var opts = idu.rectangularPixelFlow(startPoint,
                                              copyDirection,
                                              breadth,
                                              depth,
                                              speed); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },
      setup: function (context){
      }
  };
});
