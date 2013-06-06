
var main = function(net, exquis){
    window.load = function(){
        net.loadAnimations(exquis);
    };
    window.test = function(){
        require(["tests/clientTest"],
                function(clientTest){
                    net.saveAnimation = function(){ alert ("coucou");};
                    clientTest.test();
                },
                function(err){
                    console.log(err);
                    console.log("tests have been disabled");
                });
    }; 
    window.load();
    window.test();
};

require(["net", "exquis", "domReady!"], main);
