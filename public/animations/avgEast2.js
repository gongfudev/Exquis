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
              startPnt = idu.vec2d(this.breadth, this.side);                                        
          this.drawFlow(context, borders, cardinalDirection, startPnt);
          
          //top right ne
          cardinalDirection = "north",
          startPnt = idu.vec2d(this.depth, 0);
          this.drawFlow(context, borders, cardinalDirection, startPnt);
          
          //top left nw
          cardinalDirection = "south", //"east",
          //startPnt = idu.vec2d(this.depth, 0);
          startPnt = idu.vec2d(this.depth, this.breadth);
          var directionVec = idu.copyDirections[cardinalDirection];
          var opts = idu.rectangularPixelFlow(startPnt,
                                              idu.vec2dScale(directionVec, -1),
                                              this.depth,
                                              this.breadth,
                                              this.speed);
          var srcPixels = context.getImageData(0, this.breadth, this.depth, 1),
              color = idu.averageColor(srcPixels);
          // draw source rectangle
          context.fillStyle = color;
          // context.fillRect(this.depth - this.speed ,
          //                  0, this.speed, this.breadth);
          context.fillRect(0, this.breadth - this.speed ,
                           this.depth, this.speed );
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },

      drawFlow: function(context, borders, cardinalDirection, startPnt){
          var directionVec = idu.copyDirections[cardinalDirection];
          // determine source rectangle
          var sourceR = idu.makeRectangle(startPnt,
                                          idu.vec2dScale(directionVec, -1),
                                          this.breadth,
                                          this.speed);
          
          // determine color
          var color = idu.averageBorderColor(context,
                                            cardinalDirection,
                                            borders,
                                            this.depth,
                                            this.depth + this.breadth);
          // draw source rectangle
          context.fillStyle = color;
          context.fillRect(sourceR.x, sourceR.y, sourceR.width, sourceR.height);
          
          // copy source + old image
          var opts = idu.rectangularPixelFlow(startPnt,
                                              idu.vec2dScale(directionVec, -1),
                                              this.breadth,
                                              this.depth, 
                                              this.speed); 
          idu.copyContextPixels(context, opts.fromRectangle, opts.toPoint);
      },
      setup: function (context){
      }
  };
});
