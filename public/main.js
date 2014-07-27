
var main = function(net, exquisInit, evileval, makeEditorView, makeEditorController){
    window.load = function(){
        net.loadAnimations(exquisInit)
            .then(function(assemblage){
                var exquis =  exquisInit(assemblage.name, assemblage.canvasAnims);
                exquis.addEditor(makeEditorView, makeEditorController);
                // this is only for debugging in the console
                window.x = exquis;
            });

    };
    window.onerror = function(message, url, lineNumber){
        console.log(message +" "+ url +" "+ lineNumber);
    };
    window.test = function(){
        require(["tests/clientTest"],
                function(clientTest){
                    try{
                        clientTest.test(net);
                    }catch(e){
                        console.error(e.stack);
                    }
                },
                function(err){
                    console.log(err);
                    console.log("tests have been disabled");
                });
    }; 
    window.load();
};

require(["net", "exquis", "evileval", "editorView", "editorController", "lib/domReady!"], main);
