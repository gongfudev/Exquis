define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      side : 150,
      depth : 100, //margin
      breadth : 50,
      speed : 5,
      draw: function (context, borders){
          
          //bottom left sw
          var rec = idu.rectangle(0, this.breadth, this.breadth, this.depth),
              srcPixels = idu.sliceImageData(context, borders["west"],
                                             this.breadth, this.depth);
         idu.drawFlow(context, srcPixels, rec, true, this.speed);
          
          //top right ne
          rec = idu.rectangle(this.depth, 0, this.breadth, this.depth) ;
          srcPixels = idu.sliceImageData(context, borders["east"],
                                         0, this.depth);
          idu.drawFlow(context, srcPixels, rec, true, -this.speed);

          //top left nw
          rec = idu.rectangle(0, 0, this.depth, this.breadth) ;
          srcPixels = context.getImageData(0, this.breadth, this.depth, 1);
          idu.drawAvgFlow(context, srcPixels, rec, false, -this.speed);
          
          //bottom right se
          rec = idu.rectangle(this.breadth, this.depth,
                               this.depth, this.breadth) ;
          srcPixels = context.getImageData(this.breadth, this.depth - 1 , 
                                           this.depth, 1);
          idu.drawAvgFlow(context, srcPixels, rec, false, this.speed);

          //middle left
          rec = idu.rectangle(this.breadth, this.breadth,
                               this.breadth/2, this.breadth) ;
          srcPixels = context.getImageData(this.breadth -1 , this.breadth, 
                                           1, this.breadth);
          idu.drawAvgFlow(context, srcPixels, rec, true, this.speed - 2);
          
          //middle right
          rec = idu.rectangle(this.breadth * 1.5, this.breadth,
                               this.breadth/2, this.breadth) ;
          srcPixels = context.getImageData(this.depth +1  , this.breadth, 
                                           1, this.breadth);
          idu.drawAvgFlow(context, srcPixels, rec, true, -this.speed + 2);
      },
      setup: function (context){
      }
  };
});
