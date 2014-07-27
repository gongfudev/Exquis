
var main = function(net, exquisInit, evileval, makeEditorView){
    window.load = function(){
        net.loadAnimations(exquisInit)
            .then(function(assemblage){
                window.x = exquisInit(
                           assemblage.name,
                           assemblage.canvasAnims);
                window.x.addEditorView(makeEditorView);
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

require(["net", "exquis", "evileval", "editorView", "lib/domReady!"], main);
