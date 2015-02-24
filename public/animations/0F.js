define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      side : 150,
      depth : 100, //margin
      breadth : 50,
      speed : 5,
      draw: function (context, borders){
          
          //bottom left sw
          var rec = this.rectangle(0, this.breadth, this.breadth, this.depth),
              srcPixels = idu.sliceImageData(context, borders["west"],
                                             this.breadth, this.depth);
          this.drawFlow(context, srcPixels, rec, true, this.speed);
          
          //top right ne
          rec = this.rectangle(this.depth, 0, this.breadth, this.depth) ;
          srcPixels = idu.sliceImageData(context, borders["east"],
                                         0, this.depth);
          this.drawFlow(context, srcPixels, rec, true, -this.speed);

          //top left nw
          rec = this.rectangle(0, 0, this.depth, this.breadth) ;
          srcPixels = context.getImageData(0, this.breadth, this.depth, 1);
          this.drawAvgFlow(context, srcPixels, rec, false, -this.speed);
          
          //bottom right se
          rec = this.rectangle(this.breadth, this.depth,
                               this.depth, this.breadth) ;
          srcPixels = context.getImageData(this.breadth, this.depth - 1 , 
                                           this.depth, 1);
          this.drawAvgFlow(context, srcPixels, rec, false, this.speed);

          //middle left
          rec = this.rectangle(this.breadth, this.breadth,
                               this.breadth/2, this.breadth) ;
          srcPixels = context.getImageData(this.breadth -1 , this.breadth, 
                                           1, this.breadth);
          this.drawAvgFlow(context, srcPixels, rec, true, this.speed - 2);
          
          //middle right
          rec = this.rectangle(this.breadth * 1.5, this.breadth,
                               this.breadth/2, this.breadth) ;
          srcPixels = context.getImageData(this.depth +1  , this.breadth, 
                                           1, this.breadth);
          this.drawAvgFlow(context, srcPixels, rec, true, -this.speed + 2);
      },
      rectangle: function(x, y, width, height){
          return {x: x, y: y, width: width, height: height} ;
      },
      drawFlow: function(context, srcPixels, rectangle, horizontal, speed){
          var opts = idu.pixelFlowParams(rectangle, horizontal, speed); 
          this.drawPixels(context, opts.changeRectangle, srcPixels, horizontal);
          idu.copyContextPixels(context, opts.copyRectangle, opts.pastePoint);
      },
      drawAvgFlow: function(context, srcPixels, rectangle, horizontal, speed){
          var opts = idu.pixelFlowParams(rectangle, horizontal, speed); 
          this.drawAvgColor(context, opts.changeRectangle, srcPixels);
          idu.copyContextPixels(context, opts.copyRectangle, opts.pastePoint);
      },
      drawAvgColor: function(context, chgRec, srcPixels){
          var color = idu.averageColor(srcPixels);
          context.fillStyle = color;
          context.fillRect(chgRec.x, chgRec.y, chgRec.width, chgRec.height);
      },
      drawPixels: function(context, chgRec, srcPixels, horizontal){
          var size = horizontal ? chgRec.width : chgRec.height,
              d= [0,0];
          for(var i=0; i<size; i++){
              d[horizontal? 0 : 1] = i;
              context.putImageData(srcPixels, chgRec.x + d[0], chgRec.y + d[1]);
          }
      },
      setup: function (context){
      }
  };
});
