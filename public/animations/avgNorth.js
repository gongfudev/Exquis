define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){
          var x0 = 0;
          var dx = context.canvas.width / 2;
          var marginy = 100;
          var source = borders.north;

          var avgRectX = x0;
          var avgRectY = 0;
          var avgRectWidth = dx;
          var avgRectHeight = 1;


          var halfBorder = imageDataUtils.sliceImageData(context,
                                                         source,
                                                         x0,
                                                         dx);
          var avgColorArray = imageDataUtils.averageColor(halfBorder);
          context.fillStyle = imageDataUtils.array2CSSColor(avgColorArray);
          context.fillRect(avgRectX, avgRectY, avgRectWidth, avgRectHeight);

          //copy image one pixel south
          var fromRectangle = {x: x0, 
                               y: 0, 
                               width: dx, 
                               height: context.canvas.height - marginy};

          var toPoint = {x: x0, y: 1};
          imageDataUtils.copyContextPixels(context, fromRectangle, toPoint);
          
      },
      setup: function (context){
      }
  };
});