var requirejs = require('requirejs'),
    assert = require('assert');

requirejs.config({

    paths:{
            evileval: '../public/evileval'
   }
});

requirejs(['evileval'], function(evileval){
var canvasAnim = {},
    animString = "x.animate({someattribute:'ok'})";
    evileval.addAnimationStringToCanvasAnim(canvasAnim, animString);
    assert.equal(canvasAnim.animation.someattribute, 'ok');
    assert.equal(canvasAnim.animationString, animString);
});

