
define(["csshelper"], function( csshelper){

    var modalScreen = document.getElementById("modal"),
	dialog = document.getElementById("dialog");
    
    var makeCancelButton = function(modalScreen){
        var cancelButton = document.createElement("button");
	cancelButton.textContent = "cancel";
	cancelButton.addEventListener('click', function() { csshelper.addClass(modalScreen, "invisible"); });
        return cancelButton;
    };

    var buildPrompt = function(promptText){
        return new Promise(function(resolve, reject){
            var textArea = document.createElement("textarea"),
            promptParagraph = document.createElement("p"),
            buttonRow = document.createElement("div");

            promptParagraph.textContent = promptText;
            dialog.innerHTML = "";
            dialog.appendChild(promptParagraph);
            dialog.appendChild(textArea);
            dialog.appendChild(buttonRow);

            textArea.setAttribute("id", "prompt_text_area");

            var okButton = document.createElement("button");
            okButton.textContent = "ok";
            okButton.id = "ok_button";
            okButton.addEventListener('click', function(){
                resolve(textArea.value);
                csshelper.addClass(modalScreen, "invisible");
            });
            buttonRow.appendChild(okButton);
            buttonRow.appendChild(makeCancelButton(modalScreen));
            csshelper.removeClass(modalScreen, "invisible");
            textArea.focus();

        });
    };

    var populateNamePicker = function(names, clickHandler){
	dialog.innerHTML = '';
	
	for(var i = 0; i < names.length; ++i){
	    var paragraph = document.createElement("p");
	    paragraph.textContent = names[i];
            paragraph.id = names[i];

	    paragraph.addEventListener('click', clickHandler);
	    
	    dialog.appendChild(paragraph);
	}

        dialog.appendChild(makeCancelButton(modalScreen));
	
    };

    var showDialog = function(visible){
        if (visible){
            csshelper.removeClass(modalScreen, "invisible"); 
        }else{
            csshelper.addClass(modalScreen, "invisible"); 
        }
    };

    return {
        buildPrompt: buildPrompt,
        populateNamePicker: populateNamePicker,
        showDialog: showDialog
    };
});
