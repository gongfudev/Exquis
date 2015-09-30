"use strict";



define(["/lib/jquery-2.0.2.min.js", "/lib/async.js"], function(jq, async){
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

    var asyncTests = [
        function(done, net){

            var savedAnimation,
                fileName,
                originalNetSaveAnimation = net.saveAnimation; 
            net.saveAnimation = function(cell, callback, _fileName){
                console.log(_fileName);
                savedAnimation = cell.animation.drawString;
                fileName = _fileName;
                net.saveAnimation = originalNetSaveAnimation;
            };
            var correctFileName  = "someTestAnim";
            // var codeString = "var i = 0;";
            // $("#hint-2-1").click();
            // $("#ace > textarea").val(codeString);
            // $("#ace > textarea").keyup();
            setTimeout(function(){
                $("#animation_save_as_button").click();
                $("#prompt_input").value = correctFileName;
                $("#ok_button").click();

                var result = [
                    // {name : "onSaveAsClick",
                    //  message: codeString + " != " + savedAnimation,
                    //  assertion: codeString === savedAnimation
                    // },
                    {name: "onSaveAsClick",
                     message: "file name should be " + correctFileName + " not " + fileName,
                     assertion: fileName === correctFileName
                    }];
                done(null, result);
            }, 1000);
                      
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


        
        async.mapSeries(asyncTests, function(val, cb){
            val(cb, net);
        }, function(err, results){
            var flatResults = results.reduce(function(a, b) {
                return a.concat(b);
            });
            
            var allResults = tests.concat(flatResults);
            
            allResults.forEach(function(test){
                
                testCount ++;

                if (!test.assertion){
                    failureCount ++;
                    console.log(test.message);
                };
            });

            console.log(failureCount + " failures out of " +testCount + " tests.");
        });
        
        
    };

    
    return {
        test: test
    };
});
