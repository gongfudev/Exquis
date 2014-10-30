define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){
          var y0 = context.canvas.height / 2;
          var dy = context.canvas.height / 2;
          var marginx = 10;
          var source = borders.east;


          var avgRectX = context.canvas.width - 1;
          var avgRectY = y0;
          var avgRectWidth = 1;
          var avgRectHeight = dy;


          var halfBorder = imageDataUtils.sliceImageData(context,
                                                         source,
                                                         y0 ,
                                                         dy);
          var avgColorArray = imageDataUtils.averageColor(halfBorder);
          context.fillStyle = imageDataUtils.array2CSSColor(avgColorArray);
          context.fillRect(avgRectX, avgRectY, avgRectWidth, avgRectHeight);

          //copy image one pixel west
          var fromRectangle = {x: marginx, 
                               y: y0, 
                               width: context.canvas.width - marginx, 
                               height: dy};
          var toPoint = {x: marginx - 1, y: y0};
          imageDataUtils.copyContextPixels(context, fromRectangle, toPoint);
      },
      setup: function (context){
      }
  };
});