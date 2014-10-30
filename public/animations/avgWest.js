define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){
          var y0 = context.canvas.height / 2;
          var dy = context.canvas.height / 3;
          var marginx = 100;
          var source = borders.west;

          var avgRectX = 0;
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
          var fromRectangle = {x: 0, 
                               y: y0, 
                               width: context.canvas.width - marginx, 
                               height: dy};
          var toPoint = {x: 1, y: y0};
          imageDataUtils.copyContextPixels(context, fromRectangle, toPoint);
      },
      setup: function (context){
      }
  };
});