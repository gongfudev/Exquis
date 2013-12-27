define(['ui', 'net', 'evileval'], function(ui, net, evileval){
    var makeAssemblageController = function(exquis){
        var controller = {
            load: function(pickAssemblageCallback){
                var pickAssemblage = function(e){
		    var chosenAssemblage = e.target.textContent;
                    document.location = "/assemblage/" + chosenAssemblage;
                };
            
	        net.loadJson("/assemblages/", function(files){
                    ui.showDialog(true);
                    ui.populateFilePicker(files, pickAssemblage);		
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
		    var chosenAnimation = e.target.textContent;
		    net.loadJson(net.makeJsonName(chosenAnimation), function(animation){
		        var canvasAnim = exquis.targetCell.canvasAnim;
		        evileval.addAnimationToCanvasAnim(animation, canvasAnim);
		        canvasAnim.animationName = chosenAnimation;
		        canvasAnim.setup();
		        exquis.editorView.editCanvasAnim(animation.libs, animation.setup, animation.draw, chosenAnimation);
                        ui.showDialog(false);
		    });
                };
		net.loadJson("/animations/", function(files){
                    ui.showDialog(true);
		    ui.populateFilePicker(files, pickAnimation);
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
		    canvasAnim = targetCell.canvasAnim,
		    setupString = canvasAnim.animation.setupString;
		try{
		    evileval.addLibsToCanvasAnim(canvasAnim,libsString);
		    displayLibsValidity(true);
		}catch(e){
		    displayLibsValidity(false);
		}
	    },
            onEditorSetupChange: function(setupString, displaySetupValidity){
		var targetCell = exquis.targetCell;
		targetCell.canvasAnim.updateSetup = function(){
		    var canvasAnim = targetCell.canvasAnim;
		    try{
			evileval.addSetupToCanvasAnim(canvasAnim, setupString);
			canvasAnim.setup();
			displaySetupValidity(true);
		    }catch(e){
			displaySetupValidity(false);
		    }
		};
            },
            onEditorDrawChange: function(drawString, displayDrawValidity){
		var targetCell = exquis.targetCell;
		targetCell.canvasAnim.updateDraw = function(neighbouringBorders){
		    var canvasAnim = targetCell.canvasAnim,
			drawBackup = canvasAnim.animation.draw;
		    try{
			evileval.addDrawToCanvasAnim(canvasAnim, drawString);
			canvasAnim.draw(neighbouringBorders);
			displayDrawValidity(true);
		    }catch(e){
			console.error(e);
			canvasAnim.animation.draw = drawBackup;
			canvasAnim.draw(neighbouringBorders);
			displayDrawValidity(false);
		    }
		};
            }
        };
        return controller;
    };

    return function(exquis){
        return {
            assController: makeAssemblageController(exquis),
            animController: makeAnimationController(exquis),
            textAreaController: makeTextAreaController(exquis)
        };
    };

});
