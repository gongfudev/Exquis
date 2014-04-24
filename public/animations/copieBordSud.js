x.animate({libs:{},
setup: function(context, lib){
this.nbPixels = 1;},
draw: function(context, borders, lib){
// paste current image one pixel down
var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
context.putImageData(currentImage, 0, -this.nbPixels);
// add new line
for(var i=0; i<this.nbPixels+1; i++){
context.putImageData(borders.south, 0, context.canvas.height - i);    
}
}});