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
        
            textAreaSetup.getSession().on('change', function(e) {
                textAreaController.onEditorSetupChange(textAreaSetup.getValue(), displaySetupValidity)
            });
        };
        
        var addDrawListener = function(textAreaDraw, displayDrawValidity){
            displayDrawValidity(true);
 
            textAreaDraw.getSession().on('change', function(e) {
                textAreaController.onEditorDrawChange(textAreaDraw.getValue(), displaySetupValidity)
            });
        };
        
	var editor = document.getElementById("editor"),
            displayAssemblageName = makeTextContentSetter(document.getElementById("assemblage_name")),
            displayAnimationName = makeTextContentSetter(document.getElementById("filename_display")),
            textAreaSetup = ace.edit("text_area_setup"),
	    textAreaDraw =  ace.edit("text_area_draw"),
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


        // textAreaSetup.setTheme("ace/theme/monokai");
        textAreaSetup.getSession().setMode("ace/mode/javascript");
        textAreaDraw.getSession().setMode("ace/mode/javascript");
        textAreaSetup.renderer.setShowGutter(false); 
        textAreaDraw.renderer.setShowGutter(false); 

	var setEditorContent = function(libsString, setupString, drawString, animationName){
            textAreaLibs.value = libsString;
            textAreaSetup.setValue(setupString);
            textAreaDraw.setValue(drawString);
            displayAnimationName(animationName);
	    displaySetupValidity(true);
	    displayDrawValidity(true);
            displayLibsValidity(true);
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
