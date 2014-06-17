define(['ui', 'net', 'evileval'], function(ui, net, evileval){
    var view;
    var makeAssemblageController = function(exquis){
        var controller = {
            load: function(pickAssemblageCallback){
                var pickAssemblage = function(e){
		    var chosenAssemblage = e.target.textContent;
                    document.location = "/assemblage/" + chosenAssemblage;
                };
            
	        net.loadJson("/assemblages/", function(files){
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
                
                ui.buildPrompt("enter file name",function(fileName){
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
		    var chosenAnimationName = e.target.textContent;
		    net.loadAnimation(net.makeAnimationFileName(chosenAnimationName), function(animation){
		        var canvasAnim = exquis.targetCell.canvasAnim;
		        evileval.addAnimationToCanvasAnim(animation, canvasAnim, exquis);
		        canvasAnim.animationName = chosenAnimationName;
		        canvasAnim.setup();
                        updateWithCanvasAnim(canvasAnim);
		        // view.setEditorContent(chosenAnimationName, canvasAnim);
                        
                        ui.showDialog(false);
		    });
                };
		net.loadJson("/animations/", function(files){
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
                ui.buildPrompt("enter file name",function(fileName){
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
            onEditorLibsChange: function(libsString, displayLibsValidity){
		var targetCell = exquis.targetCell,
		    canvasAnim = targetCell.canvasAnim;
		try{
		    evileval.addLibsToCanvasAnim(canvasAnim,libsString);
		    displayLibsValidity(true);
		}catch(e){
		    displayLibsValidity(false);
		}
	    },
            onCodeChange: function(codeString, displayValidity){
		var targetCell = exquis.targetCell;
                // TODO: call displayValidity
		targetCell.canvasAnim.evaluateCode = function(){
		    var canvasAnim = targetCell.canvasAnim;

                    evileval.evalAnimation(exquis, codeString, targetCell.canvasAnim, function(){
                        // console.log(arguments);
                    });
		};
            }
        };
        return controller;
    };

    var updateWithCanvasAnim = function(canvasAnim){
        if (canvasAnim.uri.match(/^data:/)){
            var animCode = dataUri2text(canvasAnim.uri);
            view.setEditorContent(canvasAnim.animationName, animCode); 
        }else{
            net.loadText(function(animCode, path){
                var uri = evileval.toDataUri(animCode);
                canvasAnim.uri = uri; 
                view.setEditorContent(canvasAnim.animationName, animCode); 
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
