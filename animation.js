 var Animation = function(){

 	var self = this;

 	return {
	    init: function( canvas){
	    	self.canvas = canvas;
            self.context = canvas.getContext("2d");
            self.setup();
	    },
	    setup: function() {
	    },
	    draw: function(borders) {
	        throw ("redefine me");
	    },
	    canvas: self.canvas
 	}
 }