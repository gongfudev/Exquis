define(["bibs/imageDataUtils"], 
function(idu){
  return {
      draw: function (context, borders){
          var rec = idu.rectangle(0, 0, 100, 150) ;
          idu.pushLine(context, borders, rec, false, 3, idu.avgColorFilter);
      },
      setup: function (context){
      }
  };
});
