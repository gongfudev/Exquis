"use strict";

define([], function(){
    var assert = function (test, message){
        if (test){
            return true;
        }else{
            console.log(message);
            return false;
        }
        
    };
    var checkHomepage = function(){
        assert(document.title == "Exquis", "The title should be Exquis");
    };

    
    var test = function(){
        checkHomepage();
        console.log("hello from test");
        alert("hello from test");
    };

    
    return {
        test: test
    };
});
