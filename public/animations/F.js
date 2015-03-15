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
              
              // closure that binds the arguments context, borders, filter
              pushAvg = function(rec, horiz, speed){
                  idu.pushLine(context, borders, rec, horiz, speed, 
                               idu.avgColorFilter);
              };
          
          pushAvg(bottomLeft, false, -this.speed);
          pushAvg(topRight, false, this.speed);
          pushAvg(topLeft, false, -this.speed);
          pushAvg(bottomRight, false, this.speed);
          pushAvg(middleLeft, true, this.speed - 2);
          pushAvg(middleRight, true, -this.speed + 2);
      },
      setup: function (context){
      }
  };
});
