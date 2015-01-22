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
          
          // determine start point (top left point of animated rectangle)
          var center = idu.vec2d(context.canvas.width / 2, 
                                 context.canvas.height /2 ),
              startPnt = idu.vec2dAddPerpendiculars(center, directionVec,
                                                    maxDepth/2 - depthStart,
                                                    breadthStart - maxBreadth/2);
          // determine source rectangle
          var sourceR = idu.makeRectangle(startPnt,
                                          idu.vec2dScale(directionVec, -1),
                                          breadth, speed);
          
          // determine color
          var color= idu.averageBorderColor(context,
                                            cardinalDirection,
                                            borders,
                                            breadthStart,
                                            breadthStart + breadth);
          // draw source rectangle
          context.fillStyle = color;
          context.fillRect(sourceR.x, sourceR.y, sourceR.width, sourceR.height);
          
          // copy source + old image
          var opts = idu.rectangularPixelFlow(startPnt,
                                              idu.vec2dScale(directionVec, -1),
                                              breadth, depth, speed); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },
      setup: function (context){
      }
  };
});
