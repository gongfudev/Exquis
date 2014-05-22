define({libs:{},
setup: function(context, lib){
this.toRadians = function(degrees){
    return  degrees * Math.PI / 180; 
};
this.rotation = 0;
this.halfWidth = context.canvas.width / 2;
this.halfHeight = context.canvas.height / 2;

this.lines = [];},
draw: function(context, borders, lib){


// copy lines from borders.west
var pix = borders.west.data;

// Loop over each pixel and set a transparent red.
for (var i = 0, n = pix.length; i < n; i += 4) {
  pix[i+3] = 190; // alpha channel
}

this.lines.unshift(borders.west);

if (this.lines.length > 150){
    this.lines.pop();
}


for(var i = 0; i < this.lines.length; i++){
    context.putImageData(this.lines[i], i, 0);
}


// draw rotating red square
context.fillStyle = "rgba(20,0,200,0.1)";
context.fillRect(0, 0, context.canvas.width, context.canvas.height);

context.save();
context.translate(this.halfWidth, this.halfHeight);
context.scale(3, 2.9  );
context.rotate(this.toRadians(this.rotation));

this.rotation = (this.rotation + 1) % 360;

context.fillStyle = "rgba(250,20,25,0.5)";
context.fillRect(-25, -25, 50, 50);

context.restore();


 }});