define(["bibs/imageDataUtils"], 
function(idu){
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
          var source = borders[cardinalDirection];
//DIFFERENT
          
          var avgLineX0 = context.canvas.width - 1;
          var avgLineY0 = y0;
          var avgLineX1 = avgLineX0;
          var avgLineY1 = avgLineY0 + dy;

          var fromRectangle = {x: 0, 
                               y: y0, 
                               width: context.canvas.width - margin, 
                               height: dy};

          
          var negativeDirection = copyDirection.x === -1 || copyDirection.y === -1;
          if(negativeDirection){
              var vertical = copyDirection.x === 0 ;
              fromRectangle[vertical ? "y" : "x"] += margin;
          }
          var toPoint = {x: fromRectangle.x + copyDirection.x,
                         y: fromRectangle.y + copyDirection.y};

          var halfBorder = idu.sliceImageData(context, source, y0 ,dy);
          var avgColorArray = idu.averageColor(halfBorder);
          context.strokeStyle = idu.array2CSSColor(avgColorArray);
          context.beginPath();
          context.moveTo(avgLineX0, avgLineY0);
          context.lineTo(avgLineX1, avgLineY1);
          context.closePath();
          context.stroke();

          var startPoint = idu.vec2d(fromRectangle.x + fromRectangle.width,
                                      fromRectangle.y);
          var depth = fromRectangle.width;
         console.log("",startPoint); 
          var breadth = fromRectangle.height;
          var directionVec = idu.vec2d(-copyDirection.x, -copyDirection.y);
          var opts = idu.rectangularPixelFlow(startPoint,
                                              breadth,
                                              depth,
                                              directionVec); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
          //copy image one pixel west
          //idu.copyContextPixels(context, fromRectangle, toPoint);
      },
      setup: function (context){
      }
  };
});
