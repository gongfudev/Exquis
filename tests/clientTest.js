"use strict";



define(["lib/jquery-2.0.2.min.js", "lib/q.min.js"], function(jq, Q){
    var isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    console.log(Q);
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
        },
        function(net){
            var savedAnimation,
                fileName;
            
            net.saveAnimation = function(cell, callback, _fileName){
                savedAnimation = cell.animation.drawString;
                fileName = _fileName;
            };
            var codeString = "var i = 0;";
            $("#hint-2-1").click();
            $("#text_area_draw").val(codeString);
            $('#text_area_draw').keyup();
            $("#save_as_button").click();
            $("#prompt_text_area").val("welcome");
            $("#ok_button").click();
            


           var results = [
               {name : "onSaveAsClick",
                message: codeString + " != " + savedAnimation,
                assertion: codeString === savedAnimation
                },
               {name: "onSaveAsClick2",
                message: "net.saveAnimation should be called with name of file",
                assertion: fileName === "welcome"
               }              
           ];

           return results;
            

        }
    ];




    var test = function(net){
        var failureCount = 0,
            testCount = 0,
            tests;

        


        tests = testsDefinitions.reduce(function(accum, nextValue){
            if (isFunction(nextValue)){
                var asserts = nextValue(net);
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
