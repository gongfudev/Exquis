define(["bibs/wanderingPoint"], function(wp){ return {
        setup: function (context){
            var startPoint = [0, 0,0];
            var limit = [0 , 255 ];
            var limits = [limit, limit, limit];
            var speed = 2  ;
            var direction = [1, 3, 1];
            this.w = wp.makeWanderer(startPoint, direction, speed, limits);

        },
        draw: function (context, borders){
            this.w.move();
            var red = Math.round(this.w.coordinates[0]);
            var green = Math.round(this.w.coordinates[1]);
            var blue = Math.round(this.w.coordinates[2]);
            context.fillStyle = "rgb("+ red +","+ green +","+blue +")";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
    }
});
