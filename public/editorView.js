define(["net", "evileval", "ui", "editorController"], function(net, evileval, ui, controller){
    var makeEditor = function(controller){
        var assController = controller.assController,
            animController = controller.animController,
            textAreaController = controller.textAreaController;
        
        var makeTextContentSetter = function(domElement){
            return function(name){
                domElement.textContent = name;
            };
        };

	var makeAssemblageButtons = function(displayAssemblageName){
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
        
        var makeAnimationButtons = function(displayAnimationName) {

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

        var addLibsListener = function(textAreaLibs, displayLibsValidity){
            displayLibsValidity(true);
            textAreaLibs.onkeyup = function(){
                textAreaController.onEditorLibsChange(textAreaLibs.value, displayLibsValidity);
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
	    textAreaLibs = document.getElementById("text_area_libs"),
            displayLibsValidity = makeDisplayCodeValidity(textAreaLibs), 
            displaySetupValidity = makeDisplayCodeValidity(textAreaSetup), 
            displayDrawValidity = makeDisplayCodeValidity(textAreaDraw); 
        addLibsListener(textAreaLibs, displayLibsValidity);
        addSetupListener(textAreaSetup, displaySetupValidity);
        addDrawListener(textAreaDraw, displayDrawValidity);
        makeAnimationButtons(displayAnimationName);
        makeAssemblageButtons(displayAssemblageName);
        displayAssemblageName(assController.getAssemblageName());

	var setEditorContent = function(libsString, setupString, drawString, animationName){
            textAreaLibs.value = libsString;
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
