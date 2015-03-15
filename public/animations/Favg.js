define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      setup: function (context){
          this.side = 150;
          this.depth = 112;
          this.breadth = this.side - this.depth;
          this.speed = 3;
          this.cornerSpeedCorr = this.depth / this.breadth / 2 + 0.5  ;
      },
      draw: function (context, borders){
          
          var topLeft = idu.rectangle(0, 0, this.depth, this.breadth),
              topRight = idu.rectangle(this.depth, 0,
                                       this.breadth, this.depth) ,
              bottomLeft = idu.rectangle(0, this.breadth, 
                                         this.breadth, this.depth) ,
              bottomRight = idu.rectangle(this.breadth, this.depth,
                                          this.depth, this.breadth) ,
              middleLeft = idu.rectangle(this.breadth, this.breadth,
                                         this.side/2 - this.breadth, 
                                         this.side - 2 * this.breadth) ,
              middleRight = idu.rectangle(this.side/2, this.breadth,
                                          this.side/2 - this.breadth, 
                                          this.side - 2 * this.breadth),
              
              // closure that binds the arguments context, borders, filter
              pushAvg = function(rec, horiz, speed){
                  idu.pushLine(context, borders, rec, horiz, speed, 
                               idu.avgColorFilter);
              },

              // aliases to make arguments more readable
              horizontal = true,
              vertical = false;
          
          pushAvg(bottomLeft,  horizontal, this.speed);
          pushAvg(bottomLeft,  vertical,   -this.speed * this.cornerSpeedCorr);
          pushAvg(topRight,    horizontal, -this.speed);
          pushAvg(topRight,    vertical,   this.speed * this.cornerSpeedCorr);
          pushAvg(topLeft,     vertical,   -this.speed);
          pushAvg(bottomRight, vertical,   this.speed);
          pushAvg(middleLeft,  horizontal, this.speed );
          pushAvg(middleRight, horizontal, -this.speed );
      }
  };
});
