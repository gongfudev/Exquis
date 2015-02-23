define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      side : 150,
      depth : 100, //margin
      breadth : 50,
      speed : 5,
      draw: function (context, borders){
          
          //bottom left sw
          var color = idu.averageBorderColor(context,
                                             "south",
                                             borders,
                                             this.depth,
                                             this.depth + this.breadth),
              rec = this.rectangle(0, this.breadth, this.breadth, this.depth) ;
          this.drawFlow(context, color, rec, false, -this.speed);
          
          //top right ne
          rec = this.rectangle(this.depth, 0, this.breadth, this.depth) ;
          color = idu.averageBorderColor(context,
                                         "north",
                                         borders,
                                         this.depth,
                                         this.depth + this.breadth);
          this.drawFlow(context, color, rec, false, this.speed);

          //top left nw
          rec = this.rectangle(0, 0, this.depth, this.breadth) ;
          var srcPixels = context.getImageData(0, this.breadth, this.depth, 1);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, rec, false, -this.speed);
          
          //bottom right se
          rec = this.rectangle(this.breadth, this.depth,
                               this.depth, this.breadth) ;
          srcPixels = context.getImageData(this.breadth, this.depth - 1 , 
                                           this.depth, 1);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, rec, false, this.speed);

          //middle left
          rec = this.rectangle(this.breadth, this.breadth,
                               this.breadth/2, this.breadth) ;
          srcPixels = context.getImageData(this.breadth -1 , this.breadth, 
                                           1, this.breadth);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, rec, true, this.speed - 2);
          
          //middle right
          rec = this.rectangle(this.breadth * 1.5, this.breadth,
                               this.breadth/2, this.breadth) ;
          srcPixels = context.getImageData(this.depth +1  , this.breadth, 
                                           1, this.breadth);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, rec, true, -this.speed + 2);
      },
      rectangle: function(x, y, width, height){
          return {x: x, 
                  y: y, 
                  width: width, 
                  height: height} ;
      },
      drawFlow: function(context, color, rectangle, horizontal, speed){
          var opts = idu.pixelFlowParams(rectangle,
                                                    horizontal, 
                                                    speed), 
              srcRec = opts.changeRectangle;
          
          context.fillStyle = color;
          context.fillRect(srcRec.x, srcRec.y, srcRec.width, srcRec.height);

          idu.copyContextPixels(context, opts.copyRectangle, opts.pastePoint);
      },

      setup: function (context){
      }
  };
});
