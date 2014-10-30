define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){
          var x0 = 0;
          var dx = borders.north.width / 2;
          var marginy = 100;
          var halfBorder = imageDataUtils.sliceImageData(context,
                                                         borders.north,
                                                         x0,
                                                         dx);
          var avgColorArray = imageDataUtils.averageColor(halfBorder);
          context.fillStyle = imageDataUtils.array2CSSColor(avgColorArray);
          context.fillRect(x0, 0, dx, 1);

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