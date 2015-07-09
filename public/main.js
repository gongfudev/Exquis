
var makeAnimationPath = function (animName){
    if(/^https?:\/\//.exec(animName)){
        return animName;
    }
    return "/animations/" + animName + ".js";
};

var splitarray = function(input, spacing){
    var output = [];
    for (var i = 0; i < input.length; i += spacing){
        output[output.length] = input.slice(i, i + spacing);
    }
    return output;
};

var main = function(net, exquisInit, makeEditorView, makeEditorController, evileval){
    window.onerror = function(message, url, lineNumber){
        //console.log(message +" "+ url +" "+ lineNumber);
    };
    var assemblageName = net.getAssemblageNameFromUrlOrDefaultWithUrlChange();
    net.loadAssemblage(assemblageName)
        .then(function(animationNames){
            var animNamesList = animationNames.reduce(function(a, b) {
                return a.concat(b);
            }),
                animUris =  animNamesList.map(function(animName){
                    return  makeAnimationPath(animName);
                });
            var animUris2DArray = splitarray(animUris, 3);
            var exquis =  exquisInit(assemblageName, animUris2DArray,
                                     makeEditorView, makeEditorController);
            // this is only for debugging in the console
            window.x = exquis;
        });
};

require(["net", "exquis", "editorView", "editorController", "evileval", "lib/domReady!"], main);
