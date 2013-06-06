"use strict";



define(["lib/jquery-2.0.2.min.js"], function(){
    var isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    var testsDefinitions = [
        { name : "checkHomepage",
          message: "The title should be Exquis",
          assertion: document.title == "Exquis"
        },
        { name: "editorIsNotVisibleOnStartUp",
          message: "The editor should not be visible",
          assertion: $("#editor").hasClass("invisible")
        },
        { name: "nineCanvasElements",
          message: "we should have 9 canvas elements",
          assertion: $("canvas").length == 9
        },
        function(){
            $("#hint-2-1").click();

            var results  = [
                { name: "onCanvasClickEditorVisible",
                  message: "on canvas click editor should be visible",
                  assertion: ! $("#editor").hasClass("invisible")
                }];
            $("#editor").addClass("invisible");

            return results;

        }
    ];



    
    var test = function(){
        var failureCount = 0,
            testCount = 0,
            tests;


        tests = testsDefinitions.reduce(function(accum, nextValue){
            if (isFunction(nextValue)){
                var asserts = nextValue();
                accum = accum.concat(asserts);
            }else{
                accum.push(nextValue);
            }

            return accum;
        }, []);

            
        tests.forEach(function(test){
            testCount ++;

            if (!test.assertion){
                failureCount ++;
                console.log(test.message);
            };
        });
        
        console.log(failureCount + " failures out of " +testCount + " tests.");
    };

    
    return {
        test: test
    };
});
