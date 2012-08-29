



var fillTextAreasWithSavedContent = function(textAreaSetup, textAreaDraw){

	var setupString = localStorage.getItem("setupString");

	if (setupString){
		textAreaSetup.value = setupString;
	}

	var drawString = localStorage.getItem("drawString");

	if (drawString){
		textAreaDraw.value = drawString;
	}

}