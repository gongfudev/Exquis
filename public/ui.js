
define(["csshelper"], function( csshelper){

    var modalScreen = document.getElementById("modal"),
	dialog = document.getElementById("dialog"),
        dialogContent = document.getElementById("dialog_content"),
        dialogTitle = document.getElementById("dialog_title"),
        dialogFooter = document.getElementById("dialog_footer");
    
    var makeCancelButton = function(modalScreen){
        var cancelButton = document.createElement("button");
	cancelButton.textContent = "cancel";
        csshelper.addClass(cancelButton, "btn");
	cancelButton.addEventListener('click', function() {
            showDialog(false); 
        });
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
                showDialog(false);
            });
            buttonRow.appendChild(okButton);
            buttonRow.appendChild(makeCancelButton(modalScreen));
            showDialog(true);
            input.focus();

        });
    };

    var populateNamePicker = function(title, names, clickHandler){
        dialogTitle.innerHTML = title;
        dialogContent.innerHTML = "";
        dialogFooter.innerHTML = "";
	
	for(var i = 0; i < names.length; ++i){
	    var paragraph = document.createElement("p");
	    paragraph.textContent = names[i];
            paragraph.id = names[i];
            paragraph.addEventListener('click', function(e){
                clickHandler(e);
                showDialog(false);
            });
	    
	    dialogContent.appendChild(paragraph);
	}

        dialogFooter.appendChild(makeCancelButton(modalScreen));
        showDialog(true);
    };

    var setKeyHandler = function(handler){
        document.getElementsByTagName('body')[0].onkeyup = handler;
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
        populateNamePicker: populateNamePicker
    };
});
