
define(["csshelper"], function( csshelper){

    var modalScreen = document.getElementById("modal"),
	dialog = document.getElementById("dialog"),
        dialogContent = document.getElementById("dialog_content"),
        dialogTitle = document.getElementById("dialog_title"),
        dialogFooter = document.getElementById("dialog_footer");
    
    var makeCancelButton = function(modalScreen){
        var cancelButton = document.createElement("button");
	cancelButton.textContent = "cancel";
	cancelButton.addEventListener('click', function() { csshelper.addClass(modalScreen, "invisible"); });
        return cancelButton;
    };

    var buildPrompt = function(promptText){
        return new Promise(function(resolve, reject){
            var input = document.createElement("input"),
            promptParagraph = document.createElement("p"),
            buttonRow = document.createElement("div");

            promptParagraph.textContent = promptText;
            dialogTitle.innerHTML = "";
            dialogContent.innerHTML = "";
            dialogFooter.innerHTML = "";
            dialogTitle.appendChild(promptParagraph);
            dialogContent.appendChild(input);
            dialogFooter.appendChild(buttonRow);

            input.setAttribute("id", "prompt_input");

            var okButton = document.createElement("button");
            okButton.textContent = "ok";
            okButton.id = "ok_button";
            okButton.addEventListener('click', function(){
                var maybeFilename = input.value;
                if(maybeFilename){
                    resolve(maybeFilename);
                }else{
                    reject();
                }
                csshelper.addClass(modalScreen, "invisible");
            });
            buttonRow.appendChild(okButton);
            buttonRow.appendChild(makeCancelButton(modalScreen));
            csshelper.removeClass(modalScreen, "invisible");
            input.focus();

        });
    };

    var populateNamePicker = function(names, clickHandler){
        dialogTitle.innerHTML = "";
        dialogContent.innerHTML = "";
        dialogFooter.innerHTML = "";
	
	for(var i = 0; i < names.length; ++i){
	    var paragraph = document.createElement("p");
	    paragraph.textContent = names[i];
            paragraph.id = names[i];

	    paragraph.addEventListener('click', clickHandler);
	    
	    dialogContent.appendChild(paragraph);
	}

        dialogFooter.appendChild(makeCancelButton(modalScreen));
	
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
