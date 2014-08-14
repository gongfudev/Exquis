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
                    ui.showDialog(true);
                    ui.populateNamePicker(files, pickAssemblage);		
	        });
            },
            save: function(){
                net.saveAssemblage(exquis.assName, exquis.assemblage());
            },
            saveAs: function(displayAssemblageNameCallback){
                
                ui.buildPrompt("enter file name")
                .then(function(fileName){
                  if (fileName){
                      net.saveAssemblage(fileName, exquis.assemblage());
                      exquis.assName = fileName;
                      displayAssemblageNameCallback(exquis.assName);
                      history.pushState({},"...", fileName);
                  }
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
                    ui.showDialog(false);
                };
                
                // load the list of animation files available on the server
                net.HTTPgetJSON("/animations/").then(function(files){
                    files = files.filter(function(f){
                        return f.match(/\.js$/);
                    }).map(function(f){
                        return f.replace(/\.js$/, "");
                    });
                    ui.showDialog(true);
		    ui.populateNamePicker(files, pickAnimation);
		});
            },

            save: function(){
		net.saveAnimation(exquis.targetCell.canvasAnim);
            },
	    saveAs: function(displayAnimationNameCallback){
                ui.buildPrompt("enter file name")
                .then(function(fileName){
                    if (fileName){
                        net.saveAnimation(exquis.targetCell.canvasAnim, null, fileName);
                        displayAnimationNameCallback(fileName);
                        exquis.targetCell.canvasAnim.animationName = fileName;
                    } 
                });
            }
        };

        return controller;
    };

    var makeTextAreaController = function(exquis){
        var controller = {
            onCodeChange: function(codeString, displayValidity){
                var targetCell = exquis.targetCell;
                // TODO: call displayValidity
                targetCell.canvasAnim.evaluateCode = function(){
                    evileval.evalAnimation(exquis, codeString, targetCell.canvasAnim);
                };
            }
        };
        return controller;
    };

    var updateWithCanvasAnim = function(canvasAnim, newAnimationName){
        var animationName = newAnimationName || canvasAnim.animationName;
        if (canvasAnim.uri.match(/^data:/)){
            var animCode = evileval.dataUri2text(canvasAnim.uri);
            view.setEditorContent(animationName, animCode); 
        }else{
            net.HTTPget(canvasAnim.uri).then(function(animCode){
                var uri = evileval.toDataUri(animCode);
                canvasAnim.uri = uri;
                view.setEditorContent(animationName, animCode); 
            });
        }
    };
    
    return function(exquis, editorView){
        return {
            setView: function(aView) {view = aView;},
            assController: makeAssemblageController(exquis),
            animController: makeAnimationController(exquis),
            textAreaController: makeTextAreaController(exquis),
            updateWithCanvasAnim: updateWithCanvasAnim
        };
    };

});
