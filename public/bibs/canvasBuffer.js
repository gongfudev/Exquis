define(function(){

    var makeBuffer = function(width, height){
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        var bufferCtx = buffer.getContext("2d");
        
        return {
            width: width,
            height: height,
            context: bufferCtx,
            copyToBuffer: function(sourceCtx, sourcePoint){
                // Copy a rectangle the size of the buffer from sourcePoint.
                // This function does not react to translate, rotate etc..
                var x = Math.round(sourcePoint.x);
                var y = Math.round(sourcePoint.y);
                var imageData = sourceCtx.getImageData(x, y, width, height);
                bufferCtx.putImageData(imageData, 0, 0);
            },
            copyFromBuffer: function(destinationCtx){
                // use drawImage because it allows to scale,
                // translate and rotate destinationCtx
                destinationCtx.drawImage(buffer, 0, 0, width, height);
            },
            setTransparency: function(alpha){
                var imageData = bufferCtx.getImageData(0, 0, width, height);
                for (var i = 0, n = imageData.data.length; i < n; i += 4) {
                    imageData.data[i+3] = alpha;
                }
                bufferCtx.putImageData(imageData,0,0);
            }
        };
    };

    return { makeBuffer: makeBuffer };
});
