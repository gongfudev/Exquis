define(["bibs/webCam"], function(webCam){
    return {
        setup: function(context){
            if (this.v == null){
                this.v = webCam.provideVideoContext(320, 240);
            }
            this.rotation = 0;
            this.toRadians =  Math.PI / 180; 
            this.diagonal = Math.sqrt(2 * Math.pow(150,2));
        },
        draw: function(context, borders){
            
            context.save();
            context.translate(75, 75);
            context.rotate(this.rotation * this.toRadians);
            var width = this.diagonal;
            var height = width * 240 / 320;
            context.drawImage(this.v, - width / 2, - height / 2, 
                              width, height);
            context.restore();
            
            this.rotation = this.rotation + 1;
        }
    };
});
