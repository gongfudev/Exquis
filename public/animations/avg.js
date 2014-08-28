define(["bibs/imageDataUtils"], 
function(imageDataUtils){
  return {
      draw: function (context, borders){

          var halfBorder = imageDataUtils.sliceImageData(context,
                                                         borders.north,
                                                         0,
                                                         borders.north.width / 2);
          var avgColorArray = imageDataUtils.averageColor(halfBorder);
          context.fillStyle = imageDataUtils.array2CSSColor(avgColorArray);
          context.fillRect(0, 0, borders.north.width/2, 1);

          //copy image one pixel south
          var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
          context.putImageData(currentImage, 0, 1);
          
      },
      setup: function (context){
      }
  };
});