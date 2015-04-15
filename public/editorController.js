define(['ui', 'net', 'evileval'], function(ui, net, evileval){
    var view;
    var makeAssemblageController = function(exquis){
        var controller = {
            load: function(){
                var pickAssemblage = function(e){
                  var chosenAssemblage = e.target.textContent;
                  document.location = "/assemblage/" + chosenAssemblage;
              };

              net.HTTPgetJSON("/assemblages/").then(function(files){
                files = files.filter(function(f){
                    return f.match(/\.json$/);
                }).map(function(f){
                    return f.replace(/\.json$/, "");
                });
                ui.populateNamePicker("choose assemblage", files, pickAssemblage);		
            });
          },
            save: function(){
                net.saveAssemblage(exquis.assName, exquis.assemblage());
            },
            saveAs: function(){
                return ui.buildPrompt("enter file name")
                .then(function(fileName){
                    net.saveAssemblage(fileName, exquis.assemblage());
                    exquis.assName = fileName;
                    history.pushState({},"...", fileName);
                    return exquis.assName;
                });
            },
            getAssemblageName: function(){
                return exquis.assName;
            }
        };
        return controller;
    };

    var makeAnimationController = function(exquis){

        var controller = {
            load: function(){
                var pickAnimation = function(e){
		    var chosenAnimationName = e.target.textContent,
                        canvasAnim = exquis.targetCell.canvasAnim;
                    canvasAnim.uri = net.makeAnimationFileUri(chosenAnimationName);
                    updateWithCanvasAnim(canvasAnim, chosenAnimationName);
                };
                
                // load the list of animation files available on the server
                net.HTTPgetJSON("/animations/").then(function(files){
                    files = files.filter(function(f){
                        return f.match(/\.js$/);
                    }).map(function(f){
                        return f.replace(/\.js$/, "");
                    });
		    ui.populateNamePicker("choose animation", files, pickAnimation);
		});
            },

            save: function(){
		net.saveAnimation(exquis.targetCell.canvasAnim);
            },
	    saveAs: function(){
                return ui.buildPrompt("enter file name")
                .then(function(fileName){
                    net.saveAnimation(exquis.targetCell.canvasAnim, null, fileName);
                    exquis.targetCell.canvasAnim.animationName = fileName;
                    return fileName;
                });
            }
        };

        return controller;
    };

    var makeTextAreaController = function(exquis){
        var controller = {
            onCodeChange: function(codeString){
                var targetCell = exquis.targetCell,
                    evaluatedPromise = new Promise(function(resolve, reject){
                        targetCell.canvasAnim.evaluateCode = function(){
                            evileval.evalAnimation(codeString, targetCell.canvasAnim)
                            .then(function(){
                                resolve();
                            }, function(err){
                                console.log(err);
                                reject(err);
                            });
                        };
                    });
                    return evaluatedPromise;
            }
        };
        return controller;
    };

    var updateWithCanvasAnim = function(canvasAnim, newAnimationName){
        var animationName = newAnimationName || canvasAnim.animationName;
        
        if (canvasAnim.uri.match(/^data:/)){
            var animCode = evileval.dataUri2text(canvasAnim.uri);
            view.setEditorContent(animationName, animCode); 
            canvasAnim.animationName = animationName;
        }else{
            net.HTTPget(canvasAnim.uri).then(function(animCode){
                var uri = evileval.toDataUri(animCode);
                canvasAnim.uri = uri;
                canvasAnim.animationName = animationName;
                view.setEditorContent(animationName, animCode); 
            });
        }
    };
    
    return function(exquis, makeEditorView){
        var controller = {
            assController: makeAssemblageController(exquis),
            animController: makeAnimationController(exquis),
            textAreaController: makeTextAreaController(exquis),
            updateWithCanvasAnim: updateWithCanvasAnim
        };
        view = makeEditorView(controller);
        controller.hide = view.hide;
        controller.show = view.show;
        controller.displayInvalidity = view.displayInvalidity;
        return controller;
    };

});
