define(["net", "evileval", "ui"], function(net, evileval, ui){

    //TODO move this into ui.js
    var modalScreen = document.getElementById("modal");
    
    var makeEditor = function(exquis){
	var makeAssemblageButtons = function(exquis){
 	    var assemblageLoadButton = document.getElementById("assemblage_load_button"),
	        assemblageSaveButton = document.getElementById("assemblage_save_button"),
	        assemblageSaveAsButton = document.getElementById("assemblage_save_as_button");

            var pickAssemblage = function(e){
		var chosenAssemblage = e.target.innerHTML;
                document.location = "/assemblage/" + chosenAssemblage;
            };
            
            var assemblageLoad = function(){
		net.loadJson("/assemblages/", function(files){
                    ui.showDialog(true);
                    ui.populateFilePicker(files, pickAssemblage);		
		});
            };
            
            var assemblageSave = function(){
                net.saveAssemblage(exquis.assName, exquis.assemblage());
            };

            var assemblageSaveAs = function(){
                ui.buildPrompt("enter file name",function(fileName){
		    if (fileName){
		        net.saveAssemblage(fileName, exquis.assemblage());
                        exquis.assName = fileName;
                        // TODO: display new name of assemblage in interface
                        history.pushState({},"...", fileName);
		    }
                });
            };

            assemblageLoadButton.addEventListener('click', assemblageLoad, true);
            assemblageSaveAsButton.addEventListener('click', assemblageSaveAs, true);
            assemblageSaveAsButton.addEventListener('click', assemblageSaveAs, true);
        };
        
        var makeEditorButtons = function(exquis, filename_display) {

	    var animLoadButton = document.getElementById("animation_load_button"),
		animSaveButton = document.getElementById("animation_save_button"),
		animSaveAsButton = document.getElementById("animation_save_as_button");

            var pickAnimation = function(e){
		var chosenAnimation = e.target.innerHTML;
		net.loadJson(net.makeJsonName(chosenAnimation), function(animation){
		    var canvasAnim = exquis.targetCell.canvasAnim;
		    evileval.addAnimationToCanvasAnim(animation, canvasAnim);
		    canvasAnim.animationName = chosenAnimation;
		    canvasAnim.setup();
		    exquis.editor.editCanvasAnim(canvasAnim);
                    ui.showDialog(false);
		});
            };
            
	    var animLoad = function(){
	    	
		net.loadJson("/animations/", function(files){
                    ui.showDialog(true);
		    ui.populateFilePicker(files, pickAnimation);
		});
	    };

	    animLoadButton.addEventListener('click', animLoad, true);
	    
	    var animSave = function(){
		net.saveAnimation(exquis.targetCell.canvasAnim);
	    };

	    animSaveButton.addEventListener('click', animSave, true);

	    var animSaveAs = function(){
                ui.buildPrompt("enter file name",function(fileName){
		    if (fileName){
		        net.saveAnimation(exquis.targetCell.canvasAnim, null, fileName);
		        filename_display.innerText = fileName;
		    }
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
			throw e;
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

	var update = function(textAreas, setupString, drawString, animationName){
	    setEditorContent(textAreas, setupString, drawString, animationName);
	    textAreas.onEditorSetupChange();
	    textAreas.onEditorDrawChange();
	};
	
	var setEditorContent = function(textAreas, setupString, drawString, animationName){
            textAreas.textAreaSetup.value = setupString;
            textAreas.textAreaDraw.value = drawString;
            filename_display.innerText = animationName;
	};
	
	return {
	    editCanvasAnim: function(canvasAnim){
		setEditorContent(textAreas,
				 canvasAnim.animation.setupString,
				 canvasAnim.animation.drawString,
				 canvasAnim.animationName);
	    },
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
