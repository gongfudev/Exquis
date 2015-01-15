define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      draw: function (context, borders){
          var cardinalDirection = "east",
              directionVec = idu.copyDirections[cardinalDirection],
              
              depthStart = 10,
              isFlowHorizontal = directionVec.x,
              maxDepth =   context.canvas[isFlowHorizontal ? "width" : "height"]  ,
              depth = maxDepth - 10 - depthStart, //margin
              
              breadthStart = 100,
              maxBreadth =  context.canvas[isFlowHorizontal ? "height" : "width"]  , 
              breadth = maxBreadth - breadthStart,
              speed = 5; 

          // determine color
          var isInverted = cardinalDirection == "south" || cardinalDirection == "west";
          context.fillStyle = idu.averageBorderColor(context,
                                                     borders[cardinalDirection],
                                                     breadthStart,
                                                     breadthStart + breadth,
                                                     isInverted);

          // fill source rectangle
          var startPoint = idu.topRightForDirection(directionVec,
                                                    context.canvas.width, 
                                                    context.canvas.height, 
                                                    breadthStart, depthStart),

              sourceR = idu.makeRectangle(startPoint,
                                          idu.scaleVec(directionVec, -1),
                                          breadth, speed);
          context.fillRect(sourceR.x, sourceR.y, sourceR.width, sourceR.height);
          
          // copy source + old image
          var opts = idu.rectangularPixelFlow(startPoint,
                                              idu.scaleVec(directionVec, -1),
                                              breadth, depth, speed); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },
      setup: function (context){
      }
  };
});
