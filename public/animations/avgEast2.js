define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      draw: function (context, borders){
          var copyDirections = {
              north: {x:0, y:0},
              east:  {x:1, y:0},
              south: {x:0, y:0},
              west:  {x:-1, y:0}
          };
//DIFFERENT
          var cardinalDirection = "west";
          var copyDirection = copyDirections[cardinalDirection];
          var y0 = context.canvas.height * 2 / 3;
          var dy = context.canvas.height / 3;
          var margin = 10;
          var source = borders["east"];
//DIFFERENT
          
          var avgLineX0 = context.canvas.width - 1;
          var avgLineY0 = y0;
          var avgLineX1 = avgLineX0;
          var avgLineY1 = avgLineY0 + dy;

          var sourcePixels = idu.sliceImageData(context, source, y0 ,dy);
          var avgColorArray = idu.averageColor(sourcePixels);
          var lineColor = idu.array2CSSColor(avgColorArray);
          context.fillStyle = lineColor;
          
          var speed = 5;
          context.fillRect(context.canvas.width - speed, y0, speed, dy);

          var startPoint = idu.vec2d(context.canvas.width, y0);
          var depth = context.canvas.width - margin;
          var breadth = dy;
          var directionVec = idu.vec2d(-copyDirection.x, -copyDirection.y);
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
