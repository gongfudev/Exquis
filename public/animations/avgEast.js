define(["bibs/imageDataUtils"], 
function(idu){
  return {
      draw: function (context, borders){
          var rec = idu.rectangle(0, 50, 150, 100) ;
          idu.pushLine(context, borders, rec, true, -5, idu.avgColorFilter);
      },
      setup: function (context){
      }
  };
});
