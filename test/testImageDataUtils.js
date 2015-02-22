var requirejs = require("requirejs"),
    assert = require("assert");

var testRotateVec90cw = function(idu){
    var result = idu.rotateVec90cw({x: 1, y: 0}),
        expected = {x: 0, y: 1};
    assert.deepEqual(result, expected);
};

var testRotateVec = function(idu){
    var result = idu.rotateVec({x: 1, y: 0}, Math.PI / 2);
    assert.ok(result.x < 0.00001 && result.x > 0); //it's not exactly zero
    assert.equal(result.y, 1);
};

var testMakeRectangle = function(idu){

    var startPoint = idu.vec2d(12, 3),
        depth = 4,
        breadth = 3,
        directionVec = idu.vec2d(-1, 0);
    
    var result = idu.makeRectangle(startPoint,
                                   directionVec,
                                   breadth,
                                   depth);

    var expected = { x: 8, y: 3, width: 4, height:3 };
    assert.deepEqual(result, expected);
};

var testPixelFlowParamsHorizontalPositive = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 3},
        horizontal = true,
        speed = 1;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.copiedRectangle, 
                     { x: 7, y: 3, width: 4, height:3 });
    assert.deepEqual(result.toPoint, 
                     { x: 8, y: 3 });
    assert.deepEqual(result.sourceRectangle, 
                     { x: 7, y: 3, width: 1, height:3 });
};

var testPixelFlowParamsHorizontalNegative = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 3},
        horizontal = true,
        speed = -1;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.copiedRectangle, 
                     { x: 8, y: 3, width: 4, height:3 });
    assert.deepEqual(result.toPoint, 
                     { x: 7, y: 3 });
    assert.deepEqual(result.sourceRectangle, 
                     { x: 11, y: 3, width: 1, height:3 });
};

var testPixelFlowParamsVerticalPositive = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 6},
        horizontal = false,
        speed = 2;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.sourceRectangle, 
                     { x: 7, y: 3, width: 5, height: 2 });
    assert.deepEqual(result.copiedRectangle, 
                     { x: 7, y: 3, width: 5, height: 4 });
    assert.deepEqual(result.toPoint, 
                     { x: 7, y: 5 });
};

var testPixelFlowParamsVerticalNegative = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 6},
        horizontal = false,
        speed = -2;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.copiedRectangle, 
                     { x: 7, y: 5, width: 5, height: 4 });
    assert.deepEqual(result.toPoint, 
                     { x: 7, y: 3 });
    assert.deepEqual(result.sourceRectangle, 
                      { x: 7, y: 7, width: 5, height: 2 });
};

var testRectangularPixelFlow = function(idu){

    var startPoint = idu.vec2d(12, 3),
        depth = 5,
        breadth = 3,
        directionVec = idu.vec2d(-1, 0);
    
    var result = idu.rectangularPixelFlow(startPoint,
                                          directionVec,
                                          breadth,
                                          depth);

    var expected = {
        fromRectangle: { x: 8, y: 3, width: 4, height:3 },
        toPoint: { x: 7, y: 3 }
    };
    assert.deepEqual(result, expected);
};

var testRectangularPixelFlowCopyDepth = function(idu){

    var startPoint = idu.vec2d(12, 3),
        depth = 5,
        breadth = 3,
        directionVec = idu.vec2d(-1, 0),
        copyDepth = 2;
    
    var result = idu.rectangularPixelFlow(startPoint,
                                          directionVec,
                                          breadth,
                                          depth,
                                          copyDepth);

    var expected = {
        fromRectangle: { x: 9, y: 3, width: 3, height:3 },
        toPoint: { x: 7, y: 3 }
    };
    assert.deepEqual(result, expected);
};


requirejs(['../public/bibs/imageDataUtils'], function(imageDataUtils){
    testMakeRectangle(imageDataUtils);
    testRotateVec90cw(imageDataUtils);
    testRotateVec(imageDataUtils);
    testRectangularPixelFlow(imageDataUtils);
    testPixelFlowParamsHorizontalPositive(imageDataUtils);
    testPixelFlowParamsVerticalPositive(imageDataUtils);
    testPixelFlowParamsVerticalNegative(imageDataUtils);
    testPixelFlowParamsHorizontalNegative(imageDataUtils);
});
