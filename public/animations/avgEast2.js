define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {

/*

*/
      draw: function (context, borders){
          var copyDirections = {
              north: {x:0, y:-1},
              east:  {x:1, y:0},
              south: {x:0, y:1},
              west:  {x:-1, y:0}
          },
              dimensions = idu.vec2d(context.canvas.width, 
                                     context.canvas.height),
              center = idu.vec2d(dimensions.x / 2, dimensions.y /2);
          
//DIFFERENT
          var cardinalDirection = "east",
              directionVec = copyDirections[cardinalDirection],
              //this only works when we're in a square: dimensions.x == y
              diagonal = Math.sqrt(2 * Math.pow(dimensions.x,2)),
              toStart = idu.scaleVec(
                  idu.rotateVec(directionVec, -Math.PI / 4), 
                  diagonal / 2);
          var startPoint = idu.vec2dAdd(center, toStart);
          // idu.vec2d(
          //     context.canvas.width, 
          //     0);
              //context.canvas.height * 2 / 3);
          //var breadth = context.canvas.height / 3;
          //var depth = context.canvas.width - 10; //margin
          var depth =  directionVec.x ? 
              context.canvas.width : context.canvas.height;
          depth -= 10; //margin
          var breadth = directionVec.y ? 
              context.canvas.width : context.canvas.height;
          
          var source = borders[cardinalDirection];
          //only for east...
          var sourcePixels = idu.sliceImageData(context, source, 
                                                startPoint.y ,breadth);
//DIFFERENT

          var avgColorArray = idu.averageColor(sourcePixels);
          var lineColor = idu.array2CSSColor(avgColorArray);
          context.fillStyle = lineColor;
          
          var speed = 5;
//only for east...
          context.fillRect(startPoint.x - speed, startPoint.y, speed, breadth);
//bug with copyDepth when west
          var opts = idu.rectangularPixelFlow(startPoint,
                                              directionVec,
                                              breadth,
                                              depth,
                                              speed); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },
      setup: function (context){
      }
  };
});
