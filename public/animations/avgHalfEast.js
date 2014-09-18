define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){
          var halfBorder = imageDataUtils.sliceImageData(context,
                                                         borders.east,
                                                         borders.east.height / 2 ,
                                                         borders.east.height / 2 );
          var avgColorArray = imageDataUtils.averageColor(halfBorder);
          context.fillStyle = imageDataUtils.array2CSSColor(avgColorArray);
          context.fillRect(context.canvas.width - 1, borders.east.height/2, 1, borders.east.height/2);

          //copy image one pixel west
          var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
          context.putImageData(currentImage, -1, 0);
          
      },
      setup: function (context){
      }
  };
});