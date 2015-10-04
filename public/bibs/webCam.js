define( function(context){
    var applyVendorPrefix = function(){
	navigator.getUserMedia = navigator.getUserMedia ||
	    navigator.webkitGetUserMedia ||
	    navigator.mozGetUserMedia ||
	    navigator.msGetUserMedia;
    };

    var provideVideoContext = function(width, height){
	var video = document.createElement("video");
	video.width = width;
	video.height = height;
	video.autoplay = true;

	var errorCallback = function(e) {
	    console.log('provideVideoContext failed', e);
	};

        /* valid resolutions
         1920:1080
         1280:720
         960:720
         640:360
         640:480
         320:240
         320:180
         */

        var video_constraints = {
      	    mandatory: {
      		maxWidth: 320, 
      		maxHeight: 240
      	    },
      	    optional: []
        };

        navigator.getUserMedia({video: video_constraints}, function(stream) {
      	    video.src = window.URL.createObjectURL(stream);
        }, errorCallback);

        return video;
    };
    
    var makeWebCam = function(width, height){
        if(!width){
            width = 320;
            height = 240;
        }

        applyVendorPrefix();
        var videoContext =  provideVideoContext(width, height);
        
        return {
            context: videoContext,
            copyFromCam : function(context){
                context.drawImage(videoContext, 0, 0, 
                                  videoContext.width, videoContext.height);
            }
        };

    };

    return {makeWebCam: makeWebCam };
});
