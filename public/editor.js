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
                        //TODO hide net and exquis in controller function
		        net.saveAssemblage(fileName, exquis.assemblage());
                        exquis.assName = fileName;
                        displayAssemblageNameCallback(exquis.assName);
                        // TODO: display new name of assemblage in interface
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
    
    
    var displayAssemblageName = function(name){
        var domElement = document.getElementById("assemblage_name");
        domElement.textContent = name;
    };
    
    var makeEditor = function(exquis){
        var assController = makeAssemblageController(exquis),
            animController = makeAnimationController(exquis);
        
	var makeAssemblageButtons = function(exquis){
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
        
        var makeEditorButtons = function(exquis, filename_display) {

	    var animLoadButton = document.getElementById("animation_load_button"),
		animSaveButton = document.getElementById("animation_save_button"),
		animSaveAsButton = document.getElementById("animation_save_as_button");

            
	    animLoadButton.addEventListener('click', animController.load, true);
	    animSaveButton.addEventListener('click', animController.save, true);

	    var animSaveAs = function(){
                animController.saveAs(function(fileName){
                    filename_display.textContent = fileName;
                });
	    };
	    animSaveAsButton.addEventListener('click', animSaveAs, true);
	};

	var makeTextAreas = function(exquis){
	    var textAreaSetup = document.getElementById("text_area_setup"),
		textAreaDraw = document.getElementById("text_area_draw");

            textAreaDraw.className = "code_valid";
            textAreaSetup.className = "code_valid";

	    var onEditorSetupChange = function(){
                // TODO extract in a controller
		var targetCell = exquis.targetCell;
		targetCell.canvasAnim.updateSetup = function(){
		    var setupString = textAreaSetup.value,
			canvasAnim = targetCell.canvasAnim;
		    try{
			evileval.addSetupToCanvasAnim(canvasAnim, setupString);
			canvasAnim.setup();
			textAreaSetup.className = "code_valid";     
		    }catch(e){
			textAreaSetup.className = "code_invalid";     
		    }
		};
	    };

	    var onEditorDrawChange = function(){
                // TODO extract in a controller
		var targetCell = exquis.targetCell;
		targetCell.canvasAnim.updateDraw = function(neighbouringBorders){
		    var drawString = textAreaDraw.value,
			canvasAnim = targetCell.canvasAnim,
			drawBackup = canvasAnim.animation.draw;
		    try{
			evileval.addDrawToCanvasAnim(canvasAnim, drawString);
			canvasAnim.draw(neighbouringBorders);
			textAreaDraw.className = "code_valid";     
		    }catch(e){
			console.error(e);
			canvasAnim.animation.draw = drawBackup;
			canvasAnim.draw(neighbouringBorders);
			textAreaDraw.className = "code_invalid";     
		    }
		};
		
	    };


	    textAreaSetup.onkeyup = onEditorSetupChange;
	    textAreaDraw.onkeyup = onEditorDrawChange; 

	    return { textAreaSetup: textAreaSetup,
		     textAreaDraw: textAreaDraw,
	             onEditorSetupChange: onEditorSetupChange,
	             onEditorDrawChange: onEditorDrawChange
		   };
	};

	var textAreas = makeTextAreas(exquis),
            editor = document.getElementById("editor"),
            filename_display = document.getElementById("filename_display");
        makeEditorButtons(exquis, filename_display);
        makeAssemblageButtons(exquis);
        displayAssemblageName(exquis.assName);

	var setEditorContent = function(setupString, drawString, animationName){
            textAreas.textAreaSetup.value = setupString;
            textAreas.textAreaDraw.value = drawString;
            filename_display.textContent = animationName;
	    textAreas.textAreaSetup.className = "code_valid";     
	    textAreas.textAreaDraw.className = "code_valid";     
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
