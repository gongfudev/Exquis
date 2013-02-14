define(["net", "csshelper", "evileval"], function(net, csshelper, evileval){

    var makeEditor = function(exquis){
	var makeEditorButtons = function(exquis, filename_display) {

	    var loadButton = document.getElementById("load_button"),
		saveButton = document.getElementById("save_button"),
		saveAsButton = document.getElementById("save_as_button"),
		modalFilePicker = document.getElementById("modal"),
		dialog = document.getElementById("dialog");
	    


	    var populateFilePicker = function(files){

		dialog.innerHTML = '';
		
		for(var i = 0; i < files.length; ++i){
		    var paragraph = document.createElement("p"),
			animationName = files[i].replace(/\.json$/, "");
		    paragraph.innerHTML = animationName;

		    paragraph.addEventListener('click', function(e){
			var chosenAnimation = e.target.innerHTML;
			net.loadJson(net.makeJsonName(chosenAnimation), function(animation){
			    var canvasAnim = exquis.targetCell.canvasAnim;
			    evileval.addAnimationToCanvasAnim(animation, canvasAnim);
			    canvasAnim.animationName = chosenAnimation;
			    canvasAnim.setup();
			    exquis.editor.editCanvasAnim(canvasAnim);
			    // hide modal
			    csshelper.addClass(modalFilePicker, "invisible"); 
			});
			
		    });
		    
		    dialog.appendChild(paragraph);
		}

		var cancelButton = document.createElement("button");
		cancelButton.innerHTML = "cancel";
		cancelButton.addEventListener('click', function() { csshelper.addClass(modalFilePicker, "invisible"); });
		dialog.appendChild(cancelButton);
		
	    };
	    
	    var load = function(){
	    	
		net.loadJson("/animations/", function(files){
		    csshelper.removeClass(modalFilePicker, "invisible");

		    populateFilePicker(files);
		});
	    };

	    loadButton.addEventListener('click', load, true);
	    
	    var save = function(){
		net.saveAnimation(exquis.targetCell.canvasAnim);
	    };

	    saveButton.addEventListener('click', save, true);
	    
	    var saveAs = function(){
		var fileName = prompt("enter file name");
		if (fileName){
		    net.saveAnimation(exquis.targetCell.canvasAnim, null, fileName);
		    filename_display.innerText = fileName;
		}        
	    };
	    saveAsButton.addEventListener('click', saveAs, true);
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
			addSetupToCanvasAnim(canvasAnim, setupString);
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
			addDrawToCanvasAnim(canvasAnim, drawString);
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
