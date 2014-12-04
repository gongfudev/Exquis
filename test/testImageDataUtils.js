var requirejs = require("requirejs"),
    assert = require("assert");

var testRotateVec90cw = function(idu){
    var result = idu.rotateVec90cw({x: 1, y: 0}),
        expected = {x: 0, y: 1};
    assert.deepEqual(result, expected);
};

var testRectangularPixelFlow = function(idu){

    var startPoint = idu.vec2d(12, 3),
        depth = 5,
        breadth = 3,
        directionVec = idu.vec2d(1, 0);
    
    var result = idu.rectangularPixelFlow(startPoint,
                                             breadth,
                                             depth,
                                             directionVec);

    var expected = {
        fromRectangle: { x: 7, y: 3, width: 5, height:3 },
        toPoint: { x: 6, y: 3 }
    };
    assert.deepEqual(result, expected);
};

requirejs(['../public/bibs/imageDataUtils'], function(imageDataUtils){
    testRotateVec90cw(imageDataUtils);
    testRectangularPixelFlow(imageDataUtils);
 });
