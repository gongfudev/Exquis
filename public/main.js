
var main = function(net, exquisInit, makeEditorView, makeEditorController){
    window.onerror = function(message, url, lineNumber){
        //console.log(message +" "+ url +" "+ lineNumber);
    };
    net.loadAnimations()
        .then(function(assemblage){
            var exquis =  exquisInit(assemblage.name, assemblage.canvasAnims);
            exquis.addEditor(makeEditorView, makeEditorController);
            // this is only for debugging in the console
            window.x = exquis;
        });
};

require(["net", "exquis", "editorView", "editorController", "lib/domReady!"], main);
