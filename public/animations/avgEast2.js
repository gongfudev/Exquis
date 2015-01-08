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
          var depthStart = 10,
              depth = maxDepth - 10 - depthStart, //margin
              breadthStart = 100,
              breadth = maxBreadth - breadthStart,
              speed = 5; 

          var source = borders[cardinalDirection];
          var isInverted = cardinalDirection == "south" || cardinalDirection == "west";
          context.fillStyle = idu.averageBorderColor(context, source,
                                                     breadthStart,
                                                     breadthStart + breadth,
                                                     isInverted);
          
          var center = idu.vec2d(context.canvas.width / 2, 
                                 context.canvas.height /2 ),
              centerToSide = idu.scaleVec(directionVec, maxDepth/2),
              ccwPerp = idu.rotateVec90ccw(directionVec),
              sideToStart = idu.scaleVec(ccwPerp, maxBreadth/2 - breadthStart),
              centerToStart = idu.vec2dAdd(centerToSide, sideToStart),
              startPoint = idu.vec2dAdd(center, centerToStart),
              
              copyDirection = idu.vec2d(-directionVec.x, -directionVec.y),
              startToCopyStart = idu.scaleVec(copyDirection, depthStart),
              copyStartPoint = idu.vec2dAdd(startPoint, startToCopyStart),
              copyR = idu.makeRectangle(copyStartPoint, 
                                        copyDirection, 
                                        breadth, 
                                        speed);
          context.fillRect(copyR.x, copyR.y, copyR.width, copyR.height);
          
          var opts = idu.rectangularPixelFlow(copyStartPoint,
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
