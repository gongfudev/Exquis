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

    // TODO: fix for vertical (by the way, why is borders.east.height==149?)
    sliceImageData: function(context, imageData, start, length){
        var horizontal = imageData.height == 1,
            startIndex = start * 4,
            endIndex = (start + length) * 4, 
            result = horizontal ? context.createImageData(length, 1) : context.createImageData(1, length),
            slicedData = imageData.data.subarray(startIndex, endIndex);
        result.data.set(slicedData);
        return result;
       },

    array2CSSColor: function(colorArray){
        var alpha = colorArray.length < 4 ? 1 : colorArray[3];
        return "rgba(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + "," + alpha + ")";
    }
});
