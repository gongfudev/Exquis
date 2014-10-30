define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){
          var y0 = borders.east.height / 2;
          var dy = borders.east.height / 3;
          var marginx = 100;

          var halfBorder = imageDataUtils.sliceImageData(context,
                                                         borders.east,
                                                         y0 ,
                                                         dy);
          var avgColorArray = imageDataUtils.averageColor(halfBorder);
          context.fillStyle = imageDataUtils.array2CSSColor(avgColorArray);
          context.fillRect(context.canvas.width - 1, y0, 1, dy);

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