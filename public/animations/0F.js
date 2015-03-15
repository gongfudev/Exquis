define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      side : 150,
      depth : 100,
      breadth : 50,
      speed : 5,
      draw: function (context, borders){
          var topLeft = idu.rectangle(0, 0, this.depth, this.breadth),
              topRight = idu.rectangle(this.depth, 0,
                                       this.breadth, this.depth) ,
              bottomLeft = idu.rectangle(0, this.breadth, 
                                         this.breadth, this.depth) ,
              bottomRight = idu.rectangle(this.breadth, this.depth,
                                          this.depth, this.breadth) ,
              middleLeft = idu.rectangle(this.breadth, this.breadth,
                                         this.breadth/2, this.breadth) ,
              middleRight = idu.rectangle(this.breadth * 1.5, this.breadth,
                                          this.breadth/2, this.breadth),
              
              // closure that binds the arguments context and borders
              push = function(rec, horiz, speed, filter){
                  idu.pushLine(context, borders, rec, horiz, speed, filter);
              };

          push(bottomLeft, true, this.speed);
          push(topRight, true, -this.speed);
          push(topLeft, false, -this.speed, idu.avgColorFilter);
          push(bottomRight, false, this.speed, idu.avgColorFilter);
          push(middleLeft, true, this.speed - 2, idu.avgColorFilter);
          push(middleRight, true, -(this.speed - 2), idu.avgColorFilter);
      },
      setup: function (context){
      }
  };
});
