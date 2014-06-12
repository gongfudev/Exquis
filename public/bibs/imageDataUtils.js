define({

    // return average color in form [r, g, b, 1]
    averageColor: function(imageData){
        var pixels = imageData.data,
            totals = [0,0,0],
            avgArray;
        
        for(var i = 0; i < pixels.length; i += 4){
            totals[0] += pixels[i];
            totals[1] += pixels[i+1];
            totals[2] += pixels[i+2];
        }
        avgArray = totals.map(function(total){ return Math.round(total/pixels.length*4);});
        avgArray[3] = 1;
        return avgArray;
    },

    // should return an imageData
    // TODO: fix it (find how to slice an imageData.data array)
    sliceImageData: function(context, imageData, startX, startY, width, height){
        var startIndex = (startX + startY * imageData.width) * 4,
            endX = startX + width,
            endY = startY + height,
            endIndex =  (endX + endY * imageData.width)  * 4,
            result = context.createImageData(width, height);
        result.data.set(imageData.data.buffer.slice(startIndex, endIndex));
        return result;
    },

    array2CSSColor: function(colorArray){
        var alpha = colorArray.length < 4 ? 1 : colorArray[3];
        return "rgba(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + "," + alpha + ")";
    }
});
