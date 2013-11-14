define(["net", "evileval", "ui"], function(net, evileval, ui){
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
		        exquis.editor.editCanvasAnim(animation.setup, animation.draw, chosenAnimation);
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
		    }
                });
	    }
        };

        return controller;
    };

    var makeTextAreaController = function(exquis){
        var controller = {
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
    
    var makeEditor = function(exquis){
        var assController = makeAssemblageController(exquis),
            animController = makeAnimationController(exquis),
            textAreaController = makeTextAreaController(exquis);
        
        var makeTextContentSetter = function(domElement){
            return function(name){
                domElement.textContent = name;
            };
        };

	var makeAssemblageButtons = function(exquis, displayAssemblageName){
 	    var assemblageLoadButton = document.getElementById("assemblage_load_button"),
	        assemblageSaveButton = document.getElementById("assemblage_save_button"),
	        assemblageSaveAsButton = document.getElementById("assemblage_save_as_button");

            var assemblageSaveAs = function(){
                assController.saveAs(displayAssemblageName);
            };

            assemblageLoadButton.addEventListener('click', assController.load, true);
            assemblageSaveButton.addEventListener('click', assController.save, true);
            assemblageSaveAsButton.addEventListener('click', assemblageSaveAs, true);
        };
        
        var makeAnimationButtons = function(exquis, displayAnimationName) {

	    var animLoadButton = document.getElementById("animation_load_button"),
		animSaveButton = document.getElementById("animation_save_button"),
		animSaveAsButton = document.getElementById("animation_save_as_button");

            
	    animLoadButton.addEventListener('click', animController.load, true);
	    animSaveButton.addEventListener('click', animController.save, true);

	    var animSaveAs = function(){
                animController.saveAs(displayAnimationName);
	    };
	    animSaveAsButton.addEventListener('click', animSaveAs, true);
	};

        var makeDisplayCodeValidity = function(textArea){
            return function(valid){
                textArea.className = valid ? "code_valid" : "code_invalid";
            };
        };

        var addSetupListener = function(textAreaSetup, displaySetupValidity){
            displaySetupValidity(true);
            textAreaSetup.onkeyup = function(){
                textAreaController.onEditorSetupChange(textAreaSetup.value, displaySetupValidity);
	    };
        };
        
        var addDrawListener = function(textAreaDraw, displayDrawValidity){
            displayDrawValidity(true);
            textAreaDraw.onkeyup = function(){
                textAreaController.onEditorDrawChange(textAreaDraw.value, displayDrawValidity);
	    };
        };
        
	var editor = document.getElementById("editor"),
            displayAssemblageName = makeTextContentSetter(document.getElementById("assemblage_name")),
            displayAnimationName = makeTextContentSetter(document.getElementById("filename_display")),
            textAreaSetup = document.getElementById("text_area_setup"),
	    textAreaDraw = document.getElementById("text_area_draw"),
            displaySetupValidity = makeDisplayCodeValidity(textAreaSetup), 
            displayDrawValidity = makeDisplayCodeValidity(textAreaDraw); 
        addSetupListener(textAreaSetup, displaySetupValidity);
        addDrawListener(textAreaDraw, displayDrawValidity);
        makeAnimationButtons(exquis, displayAnimationName);
        makeAssemblageButtons(exquis, displayAssemblageName);
        displayAssemblageName(exquis.assName);

	var setEditorContent = function(setupString, drawString, animationName){
            textAreaSetup.value = setupString;
            textAreaDraw.value = drawString;
            displayAnimationName(animationName);
	    displaySetupValidity(true);
	    displayDrawValidity(true);
	};
	
	return {
	    editCanvasAnim: setEditorContent,
	    show: function(){
		editor.className = "";
	    },
	    hide: function(){
		// unselect edition
		editor.className = "invisible";
	    }};

    };

    return makeEditor;
});
