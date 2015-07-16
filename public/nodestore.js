"use strict";
/**
different implementations of the store would save the animation in different places.
The original url of the animation is independent of the store
because we want exquis to be able to just display animations from any url.
The store needs to know where to save an animation based on its url.
Currently the original url is replaced by a data uri when it is first edited,
because it's only used to load the code. We need to keep it in order to save it.
*/
define(["net", "evileval"], function(net, evileval){
    //TODO load list of animations from store
    var loadAnimationList = function(){
        return net.HTTPgetJSON("/animations/").then(function(files){
            return files.filter(function(f){
                return f.match(/\.js$/);
            });
	});
    };
    return {loadAnimationList: loadAnimationList};
});
