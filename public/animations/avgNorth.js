define({libs:{"bibs/imageDataUtils":"imageDataUtils"},
draw: function (context, borders, lib){

var imageDataUtils = lib.imageDataUtils;

var avgColorArray = imageDataUtils.averageColor(borders.north);
context.fillStyle = imageDataUtils.array2CSSColor(avgColorArray);
context.fillRect(0, 0, borders.north.width, 1);


//copy image one pixel south
var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
context.putImageData(currentImage, 0, 1);
    
},
setup: function (context, lib){
}});