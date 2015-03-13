var requirejs = require("requirejs"),
    assert = require("assert");

var testRectangle = function(idu){
    var rectangle = idu.rectangle(7, 3, 5, 3);
    assert.equal(rectangle.x, 7);
    assert.equal(rectangle.y, 3);
    assert.equal(rectangle.width, 5);
    assert.equal(rectangle.height, 3 );
    assert.deepEqual(rectangle, 
                     { x: 7, y: 3, width: 5, height:3});
};

var testPixelFlowParamsHorizontalPositive = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 3},
        horizontal = true,
        speed = 1;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.copyRectangle, 
                     { x: 7, y: 3, width: 4, height:3 });
    assert.deepEqual(result.pastePoint, 
                     { x: 8, y: 3 });
    assert.deepEqual(result.changeRectangle, 
                     { x: 7, y: 3, width: 1, height:3 });
};

var testPixelFlowParamsHorizontalNegative = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 3},
        horizontal = true,
        speed = -1;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.copyRectangle, 
                     { x: 8, y: 3, width: 4, height:3 });
    assert.deepEqual(result.pastePoint, 
                     { x: 7, y: 3 });
    assert.deepEqual(result.changeRectangle, 
                     { x: 11, y: 3, width: 1, height:3 });
};

var testPixelFlowParamsVerticalPositive = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 6},
        horizontal = false,
        speed = 2;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.changeRectangle, 
                     { x: 7, y: 3, width: 5, height: 2 });
    assert.deepEqual(result.copyRectangle, 
                     { x: 7, y: 3, width: 5, height: 4 });
    assert.deepEqual(result.pastePoint, 
                     { x: 7, y: 5 });
};

var testPixelFlowParamsVerticalNegative = function(idu){
    var rectangle = {x: 7, y: 3, width: 5, height: 6},
        horizontal = false,
        speed = -2;
    var result = idu.pixelFlowParams(rectangle, horizontal, speed);
    assert.deepEqual(result.copyRectangle, 
                     { x: 7, y: 5, width: 5, height: 4 });
    assert.deepEqual(result.pastePoint, 
                     { x: 7, y: 3 });
    assert.deepEqual(result.changeRectangle, 
                      { x: 7, y: 7, width: 5, height: 2 });
};

requirejs(['../public/bibs/imageDataUtils'], function(imageDataUtils){
    testRectangle(imageDataUtils);
    testPixelFlowParamsHorizontalPositive(imageDataUtils);
    testPixelFlowParamsVerticalPositive(imageDataUtils);
    testPixelFlowParamsVerticalNegative(imageDataUtils);
    testPixelFlowParamsHorizontalNegative(imageDataUtils);
});
