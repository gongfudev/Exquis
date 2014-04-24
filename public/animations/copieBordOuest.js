x.animate({libs:{},
setup: function(context, lib){
},
draw: function(context, borders, lib){
// paste current image one pixel down
var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
context.putImageData(currentImage, 1, 0);
// add new line
context.putImageData(borders.west, 0, 0);}});