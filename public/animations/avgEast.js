define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      draw: function (context, borders){
          var rec = idu.rectangle(0, 50, 150, 100) ;
          var srcPixels = idu.sliceImageData(context, borders["east"], 50, 100);
          idu.drawAvgFlow(context, srcPixels, rec, true, -5);
      },
      setup: function (context){
      }
  };
});
