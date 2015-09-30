define(["bibs/imageDataUtils"], function(idu){
    return {
        setup: function (context){
        },
        draw: function (context, borders){
            var rec = idu.rectangle(0, 0, 150, 100) ;
            idu.pushLine(context, borders, rec, true, 5, idu.avgColorFilter);
        }
    };
});
