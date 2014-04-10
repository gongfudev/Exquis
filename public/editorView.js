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

        var makeDisplayCodeValidityForAce = function(aceEditor){
            return function(valid){
                 aceEditor.setStyle( valid ? "code_valid" : "code_invalid");
                 aceEditor.unsetStyle( !valid ? "code_valid" : "code_invalid");
            };
        };

        var addSetupListener = function(textAreaSetup, displaySetupValidity){
            displaySetupValidity(true);
        
            textAreaSetup.getSession().on('change', function(e) {
                textAreaController.onCodeChange(textAreaSetup.getValue(),
                                                displaySetupValidity);
            });
        };

        
        
	var editor = document.getElementById("editor"),
            displayAssemblageName = makeTextContentSetter(document.getElementById("assemblage_name")),
            displayAnimationName = makeTextContentSetter(document.getElementById("filename_display")),
            textAreaSetup = ace.edit("text_area_setup"),
            displaySetupValidity = makeDisplayCodeValidityForAce(textAreaSetup); 
        addSetupListener(textAreaSetup, displaySetupValidity);
        makeAnimationButtons(displayAnimationName);
        makeAssemblageButtons(displayAssemblageName);
        displayAssemblageName(assController.getAssemblageName());


        textAreaSetup.setTheme("ace/theme/katzenmilch");
        textAreaSetup.getSession().setMode("ace/mode/javascript");
        textAreaSetup.renderer.setShowGutter(false);
        textAreaSetup.setFontSize("14px");

	var setEditorContent = function(libsString, setupString, drawString, animationName, animation){

            textAreaSetup.setValue(evileval.stringify(animation));
            textAreaSetup.getSession().selection.clearSelection();
            
            
            displayAnimationName(animationName);
            displaySetupValidity(true);
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
