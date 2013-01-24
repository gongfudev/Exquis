"use strict";

var ajax = (function(){

    var loadJsons = function(jsons, callback ){

        var results = {};
        var counter = 0;
        var handleJson = function(result, path){
            var name =  /animations\/(\w+)\.json/.exec(path)[1];
            results[name] = result;
            counter ++;
            if (counter == jsons.length ){
                callback(results);
            }
        };
        for(var i=0; i<jsons.length; i++){
           loadJson(jsons[i], handleJson);
        }

    };

    var loadJsons2d = function(jsons, callback ){

        var results = [];
        var totalFileCount = 0;
        for(var i=0; i<jsons.length; i++){
          totalFileCount += jsons[i].length;
        }

        var loadedFileCount = 0;

        var handleJson = function(result, path, position){
                var name =  /animations\/(\w+)\.json/.exec(path)[1];
                
                if(results[position.row] === undefined){
                  results[position.row] = [];
                }

                results[position.row][position.col] = { animation: result,
                                                        name: name };
                loadedFileCount++;

                if (loadedFileCount === totalFileCount){
                    callback(results);
                }
        };

        for(var i=0; i<jsons.length; i++){
          var lastrow = i == (jsons.length - 1);
          for(var j=0; j<jsons[i].length; j++){
             var position = {row: i, col: j};
             loadJson(jsons[i][j], handleJson, position);
          }
        }

    };

    //TODO add an error handler callback
    var loadJson = function(path, callback, callbackRestArgs){

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var result = JSON.parse(xmlhttp.responseText);
                callback(result, path, callbackRestArgs);
            }
        };
        xmlhttp.open("GET", path, true);
        xmlhttp.send();
    };

    var saveAnimation = function(cell, callback, fileName){
        var name = fileName || cell.animationName,
            path = "/animations/"+name+".json",
            JSONString = JSON.stringify({ setup: cell.animation.setupString,
                                          draw : cell.animation.drawString }),
            params = encodeURIComponent(JSONString), 
            ajax = new XMLHttpRequest();

        ajax.open("POST", path, true);
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajax.onreadystatechange = callback;
        ajax.send(params);
    };

    var loadAssemblage = function(name){
	var assemblagePath = "/assemblages/"+ (name ? name: "assemblageAvecSinus") + ".json";
	
        loadJson(assemblagePath, function(assemblage){
            
            var animationNames = map2dArray(assemblage, makeJsonName);

            loadJsons2d(animationNames, function(jsonAnimations){
                init(jsonAnimations);
            });
            
        });
    };

    var loadAnimations = function(){
	var name = window.location.pathname.substr("/assemblage/".length);
	loadAssemblage(name);
    };

    return {saveAnimation: saveAnimation, loadAnimations: loadAnimations, loadJson: loadJson};
})();


var map2dArray = function(array2d, func) {
    var result = [];

    for (var row = 0; row < 3; row++) {
        result.push([]);
        for (var col = 0; col < 3; col++) {
            result[row][col] = func(array2d[row][col], row, col);
        };
    };

    return result;
};

var forEach2dArray = function(array2d, func) {
    for (var row = 0; row < array2d.length; row++) {
        for (var col = 0; col < array2d[row].length; col++) {
            func(array2d[row][col], row, col);
        };
    };
};

var makeCell = function(row, col, height, width, jsonAnim){
    var canvas = makeCanvas(row, col, height, width), 
        context = canvas.getContext("2d"); 
    return {
        canvasAnim: makeCanvasAnimation(context, jsonAnim),
        hint: makeHint(row, col, height, width)
    };
};

var makeCanvasAnimation = function(context, jsonAnimation){


    var canvasAnim = {
        animation : {},
        animationName: jsonAnimation.name,

        borders : function(){
            return {
                    north: context.getImageData(0, 0, context.canvas.width, 1),
                    south: context.getImageData(0, context.canvas.height - 1, context.canvas.width, 1),
                    east: context.getImageData(context.canvas.width - 1, 0, 1 , context.canvas.height),
                    west: context.getImageData(0, 0, 1, context.canvas.height - 1)
                };
        },

        draw : function(borders){ 
            // force reset matrix
            context.setTransform(1, 0, 0, 1, 0, 0);
            this.animation.draw(context, borders);
        },

        setup : function(){ 
            // force reset matrix
            context.setTransform(1, 0, 0, 1, 0, 0);
            this.animation.setup(context);
        }
    };

    addAnimationToCanvasAnim(jsonAnimation.animation, canvasAnim);

    return canvasAnim;

};



var relativeCoordinates = {
    north : {row: -1, col: 0, opposite: "south"},
    south : {row: 1, col: 0, opposite: "north"},
    west : {row: 0, col: -1, opposite: "east"},
    east : {row: 0, col: 1, opposite: "west"}
};

var addSetupToCanvasAnim = function(canvasAnim, setupString){
    eval("canvasAnim.animation.setup = function(context) {" + setupString + "};");
    canvasAnim.animation.setupString = setupString;
};

var addDrawToCanvasAnim = function(canvasAnim, drawString){
    eval("canvasAnim.animation.draw = function(context, borders) {" + drawString + "};");
    canvasAnim.animation.drawString = drawString;
};

var functionBodyAsString = function(func){
  return func.toString().replace(/function\s*\([\w\s,]*\)\s*{\n?(\s*[\s\S]*)}/g,"$1");
  //.replace(/\n/g,"\\n");
};
    
var addAnimationToCanvasAnim = function(animation, canvasAnim){
    addDrawToCanvasAnim(canvasAnim, animation.draw);
    addSetupToCanvasAnim(canvasAnim, animation.setup);
};

var makeJsonName = function(animationName){
    return "/animations/"+animationName+".json";
};



var makeCanvas = function(row, col, height, width){
    var canvas = document.createElement('canvas');
    canvas.id = "canvas-" + row + "-" + col;
    canvas.className = "cell";
    canvas.width = width;
    canvas.height = height;
    canvas.style.top = (height * row)+"px";
    canvas.style.left = (width * col)+"px";

    document.getElementById('dashboard').appendChild(canvas);
    return canvas;
};

var makeHint = function(row, col, height, width){
    var gridHint = document.createElement('div');
    gridHint.id = "hint-" + row + "-" + col;
    gridHint.className = "hint";
    gridHint.style.top = (height * row)+"px";
    gridHint.style.left = (width * col)+"px";

    document.getElementById('dashboard').appendChild(gridHint);
    return gridHint;
};

var addClass = function(element, className){
    element.className += " "+className;
};

var removeClass = function(element, className){
    element.className = element.className.replace(RegExp(" *"+className), "");
};

var addHintListeners = function(cells){
    var showGridHint = function(show){

        forEach2dArray(cells, function(cell, row,col){
            (show ? addClass : removeClass)(cell.hint, "visible-grid");
        });
    };

    var onDashboardOver = function(e){  showGridHint(true);};
    var onDashboardOut = function(e){ showGridHint(false);};

    document.getElementById("dashboard").addEventListener("mouseover", onDashboardOver, false);
    document.getElementById("dashboard").addEventListener("mouseout", onDashboardOut, false);

};

var makeEditor = function(exquis){
    var makeEditorButtons = function(exquis, filename_display) {

	var loadButton = document.getElementById("load_button"),
	    saveButton = document.getElementById("save_button"),
	    saveAsButton = document.getElementById("save_as_button"),
	    modalFilePicker = document.getElementById("modal"),
	    dialog = document.getElementById("dialog");
	    


	var populateFilePicker = function(files){

	    var listElement = document.createElement("ul");

	    dialog.innerHTML = '';

	    dialog.appendChild(listElement);
	    
	    for(var i = 0; i < files.length; ++i){
		var listItem = document.createElement("li"),
		    animationName = files[i].replace(/\.json$/, "");
		listItem.innerHTML = "<a href='#'>"+animationName+"</a>";

		listItem.addEventListener('click', function(e){
		    var chosenAnimation = e.target.innerHTML;
		    ajax.loadJson(makeJsonName(chosenAnimation), function(animation){
			var canvasAnim = exquis.targetCell.canvasAnim;
			addAnimationToCanvasAnim(animation, canvasAnim);
			canvasAnim.animationName = chosenAnimation;
			canvasAnim.setup();
			exquis.editor.editCanvasAnim(canvasAnim);
			// hide modal
			addClass(modalFilePicker, "invisible"); 
		    });
		    
		});
		
		listElement.appendChild(listItem);
	    }

	    var cancelButton = document.createElement("button");
	    cancelButton.innerHTML = "cancel";
	    cancelButton.addEventListener('click', function() { addClass(modalFilePicker, "invisible"); });
	    dialog.appendChild(cancelButton);
		    
	};
	
	var load = function(){
	    	
	    ajax.loadJson("/animations/", function(files){
		removeClass(modalFilePicker, "invisible");

		populateFilePicker(files);
	    });
	};

	loadButton.addEventListener('click', load, true);
	
	var save = function(){
            ajax.saveAnimation(exquis.targetCell.canvasAnim);
	};

	saveButton.addEventListener('click', save, true);
	
	var saveAs = function(){
            var fileName = prompt("enter file name");
            if (fileName){
		ajax.saveAnimation(exquis.targetCell.canvasAnim, null, fileName);
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

var exquis = {};

var init = function (jsonAnimations) {

    var container = document.getElementById("container");

    exquis.editor = makeEditor(exquis);

    exquis.cells = map2dArray(jsonAnimations,function(jsonAnim,row,col){
        var height = 150,
            width = 150,
            cell = makeCell(row, col, height, width, jsonAnim),
            edit = function(){ 
		exquis.editor.editCanvasAnim(cell.canvasAnim);
                if (exquis.targetCell) { removeClass(exquis.targetCell.hint, "visible-cell"); }
                exquis.targetCell = cell;
                addClass(exquis.targetCell.hint, "visible-cell");
            };
        cell.hint.addEventListener('click', edit, false);
        return  cell;
    });

    addHintListeners(exquis.cells);

    var onBodyClick = function(event){
        if (event.target.tagName === "HTML"){
            // unselect edition
	    exquis.editor.hide();
            if (exquis.targetCell) { removeClass(exquis.targetCell.hint, "visible-cell"); }
        }else{
	    exquis.editor.show();
        }
    };

    
    document.addEventListener('click', onBodyClick, true);

    var draw = function(){

        var allBorders = map2dArray(exquis.cells,function(cell){ 
            return cell.canvasAnim.borders();
        });
        forEach2dArray(exquis.cells,function(cell, row, col){
            var neighbouringBorders = {},
	        cells = exquis.cells,
                canvasAnim = cell.canvasAnim;
            ["north", "south", "east", "west"].forEach(function(side){
                var offset = relativeCoordinates[side];
                var siderow = (row + offset.row + cells.length) % cells.length;
                var sidecol = (col + offset.col + cells[0].length) % cells[0].length;
                neighbouringBorders[side] = allBorders[siderow][sidecol][offset.opposite];
    
            });

            if(canvasAnim.updateSetup){
                canvasAnim.updateSetup();
                delete(canvasAnim.updateSetup);
            }
            
            if(canvasAnim.updateDraw){
                canvasAnim.updateDraw(neighbouringBorders);
                delete(canvasAnim.updateDraw);
            }else{
                canvasAnim.draw(neighbouringBorders);
            }
        });
    };

    forEach2dArray(exquis.cells,function(cell){ cell.canvasAnim.setup(); });
    setInterval(draw, 50);

};

window.onload = ajax.loadAnimations;
