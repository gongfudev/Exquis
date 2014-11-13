define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){
          var copyDirections = {
              north: {x:0, y:0},
              east:  {x:-1, y:0},
              south: {x:0, y:0},
              west:  {x:1, y:0}
          };
          var direction = "west";
          var copyDirection = copyDirections[direction];
          var y0 = context.canvas.height * 2 / 3;
          var dy = context.canvas.height / 3;
          var margin = 10;
          var source = borders[direction];

          var avgLineX0 = 0;
          var avgLineY0 = y0;
          var avgLineX1 = avgLineX0;
          var avgLineY1 = avgLineY0 + dy;

          var fromRectangle = {x: 0, 
                               y: y0, 
                               width: context.canvas.width - margin, 
                               height: dy};
          var toPoint = {x: fromRectangle.x + copyDirection.x,
                         y: fromRectangle.y + copyDirection.y};

          var halfBorder = imageDataUtils.sliceImageData(context,
                                                         source,
                                                         y0 ,
                                                         dy);
          var avgColorArray = imageDataUtils.averageColor(halfBorder);
          context.strokeStyle = imageDataUtils.array2CSSColor(avgColorArray);
          context.beginPath();
          context.moveTo(avgLineX0, avgLineY0);
          context.lineTo(avgLineX1, avgLineY1);
          context.closePath();
          context.stroke();

          //copy image one pixel west
          imageDataUtils.copyContextPixels(context, fromRectangle, toPoint);
      },
      setup: function (context){
      }
  };
});
