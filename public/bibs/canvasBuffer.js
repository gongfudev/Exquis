define(function(){

    var makeBuffer = function(originalCtx, width, height){
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        var bufferCtx = buffer.getContext("2d");
        
        return {
            width: buffer.width,
            height: buffer.height,
            copyToBuffer: function(sourcePoint){
                var x = Math.round(sourcePoint.x);
                var y = Math.round(sourcePoint.y);
                var imageData = originalCtx.getImageData(sourcePoint.x, 
                                                         sourcePoint.y, 
                                                         buffer.width, 
                                                         buffer.height);
                bufferCtx.putImageData(imageData, 0, 0);
            },
            copyFromBuffer: function(destRec){
                // use drawImage because it allows to scale
                // and translate originalCtx
                originalCtx.drawImage(buffer, 
                                      0, 0,
                                      buffer.width, 
                                      buffer.height);
            }
        };
    };

    return { makeBuffer: makeBuffer};
});
