define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      side : 150,
      depth : 100, //margin
      breadth : 50,
      speed : 5,
      draw: function (context, borders){
          
          //bottom left sw
          var cardinalDirection = "south",
              // determine start point (top left point of animated rectangle)
              startPnt = idu.vec2d(this.breadth, this.side),
              color = idu.averageBorderColor(context,
                                             cardinalDirection,
                                             borders,
                                             this.depth,
                                             this.depth + this.breadth);
          this.drawFlow(context, color, cardinalDirection, startPnt, 
                        this.depth, this.breadth);
          
          //top right ne
          cardinalDirection = "north";
          startPnt = idu.vec2d(this.depth, 0);
          color = idu.averageBorderColor(context,
                                         cardinalDirection,
                                         borders,
                                         this.depth,
                                         this.depth + this.breadth);
          this.drawFlow(context, color, cardinalDirection, startPnt, 
                        this.depth, this.breadth);
          
          //top left nw
          cardinalDirection = "south",
          startPnt = idu.vec2d(this.depth, this.breadth);
          var srcPixels = context.getImageData(0, this.breadth, this.depth, 1);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, cardinalDirection, startPnt, 
                        this.breadth, this.depth);
          
          //bottom right se
          cardinalDirection = "north",
          startPnt = idu.vec2d(this.breadth, this.depth);
          srcPixels = context.getImageData(this.breadth, this.depth - 1 , 
                                           this.depth, 1);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, cardinalDirection, startPnt, 
                        this.breadth, this.depth);

          //middle left
          cardinalDirection = "west",
          startPnt = idu.vec2d(this.breadth, this.depth);
          srcPixels = context.getImageData(this.breadth -1 , this.breadth, 
                                           1, this.breadth);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, cardinalDirection, startPnt, 
                        this.breadth / 2, this.breadth);
          //middle right
          cardinalDirection = "east", 
          startPnt = idu.vec2d(this.depth, this.breadth);
          srcPixels = context.getImageData(this.depth +1  , this.breadth, 
                                           1, this.breadth);
          color = idu.averageColor(srcPixels);
          this.drawFlow(context, color, cardinalDirection, startPnt, 
                        this.breadth / 2, this.breadth);
      },

      drawFlow: function(context, color, cardinalDirection, startPnt,
                         depth, breadth){
          var directionVec = idu.copyDirections[cardinalDirection];
          // determine source rectangle
          var sourceR = idu.makeRectangle(startPnt,
                                          idu.vec2dScale(directionVec, -1),
                                          breadth,
                                          this.speed);
          
          // draw source rectangle
          context.fillStyle = color;
          context.fillRect(sourceR.x, sourceR.y, sourceR.width, sourceR.height);
          
          // copy source + old image
          var opts = idu.rectangularPixelFlow(startPnt,
                                              idu.vec2dScale(directionVec, -1),
                                              breadth,
                                              depth, 
                                              this.speed); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },
      setup: function (context){
      }
  };
});
