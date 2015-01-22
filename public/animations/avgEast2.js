define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      draw: function (context, borders){
          var cardinalDirection = "east",
              directionVec = idu.copyDirections[cardinalDirection],
              
              depthStart = 10,
              isFlowHorizontal = directionVec.x,
              maxDepth =  context.canvas[isFlowHorizontal ? "width" : "height"],
              depth = maxDepth - 10 - depthStart, //margin
              
              breadthStart = 100,
              maxBreadth = context.canvas[isFlowHorizontal ? "height" : "width"],
              breadth = maxBreadth - breadthStart,
              speed = 5; 

          // determine color
          var isInverted = cardinalDirection == "south"; 
              isInverted = isInverted || cardinalDirection == "west";
          context.fillStyle = idu.averageBorderColor(context,
                                                     borders[cardinalDirection],
                                                     breadthStart,
                                                     breadthStart + breadth,
                                                     isInverted);

          // fill source rectangle
          var center = idu.vec2d(context.canvas.width / 2, 
                                 context.canvas.height /2 );
          var startPoint = idu.vec2dAddPerpendiculars(center, directionVec,
                                           maxDepth/2 - depthStart,
                                           - maxBreadth/2 + breadthStart),

              sourceR = idu.makeRectangle(startPoint,
                                          idu.vec2dScale(directionVec, -1),
                                          breadth, speed);
          context.fillRect(sourceR.x, sourceR.y, sourceR.width, sourceR.height);
          
          // copy source + old image
          var opts = idu.rectangularPixelFlow(startPoint,
                                              idu.vec2dScale(directionVec, -1),
                                              breadth, depth, speed); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },
      setup: function (context){
      }
  };
});
