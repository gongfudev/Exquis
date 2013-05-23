
var main = function(net, exquis){
    net.loadAnimations(exquis);
    window.test = function(){
        require(["tests/clientTest"],
                function(clientTest){
                    clientTest.test();
                },
                function(err){
                    console.log("tests have been disabled");
                });
    }; 
};

require(["net", "exquis", "domReady!"], main);
