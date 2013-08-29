"use strict";

define({
    
    map2dArray: function(array2d, func) {
	var result = [];

	for (var row = 0; row < 3; row++) {
            result.push([]);
            for (var col = 0; col < 3; col++) {
		result[row][col] = func(array2d[row][col], row, col);
            };
	};

	return result;
    },

    forEach2dArray : function(array2d, func) {
	for (var row = 0; row < array2d.length; row++) {
            for (var col = 0; col < array2d[row].length; col++) {
		func(array2d[row][col], row, col);
            };
	};
    }
});
