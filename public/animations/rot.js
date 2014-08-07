define({
setup: function(context){
this.TO_RADIANS = Math.PI/180; 
 
this.buffer = document.createElement('canvas');
this.buffer.width = context.canvas.width;
this.buffer.height = context.canvas.height;
this.bufferCtx = this.buffer.getContext("2d");
  
this.rotation = 0;
this.framecount=0;},
draw: function(context, borders, lib){
this.framecount++;
context.putImageData(borders.west, 0, 0);

this.bufferCtx.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height);
context.save();
context.rotate(this.rotation * this.TO_RADIANS);
this.rotation = Math.sin(this.framecount/50);//-5;//(this.rotation - 0.5) % 360;
context.drawImage(this.buffer, 0,0, context.canvas.width, context.canvas.height);
context.restore();}});