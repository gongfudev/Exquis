define({
    addClass : function(element, className){
	element.className += " "+className;
    },
    removeClass : function(element, className){
	element.className = element.className.replace(RegExp(" *"+className), "");
    }
}); 
