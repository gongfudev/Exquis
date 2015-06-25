"use strict";

define(["iter2d", "csshelper", "evileval", "net"], function(iter2d, csshelper, evileval, net){
            

    var makeCellDom = function(row, col, height, width){
        var canvas = makeCanvas(row, col, height, width), 
            context = canvas.getContext("2d"), 
            cell = {};
        cell.context = context;
        cell.hint = createCellDiv("hint", row, col, height, width);
        cell.ui = makeCellUi(row, col, height, width);
        return cell;
    };

    var makeCanvasAnimation = function(context, animation){
        var isJsAnim = true; 
        var canvasAnim = {
            codeToSetup : animation.codeToSetup,
            animationName: animation.animationName,
            uri: animation.uri,
            currentCode: null,
            context: context, //might be useful to debug
            borders : function(){
               return {
                    north: context.getImageData(0, 0, context.canvas.width, 1),
                    south: context.getImageData(0, context.canvas.height - 1, context.canvas.width, 1),
                    east: context.getImageData(context.canvas.width - 1, 0, 1 , context.canvas.height),
                    west: context.getImageData(0, 0, 1, context.canvas.height)
                };
            },

            draw : function(borders){
                if(!this.currentCode || !this.currentCode.draw){
                    return;
                }

                // force reset matrix/
                context.setTransform(1, 0, 0, 1, 0, 0);
                this.currentCode.draw(context, borders, this.lib);
            },

            setup : function(){
                // force reset matrix
                context.setTransform(1, 0, 0, 1, 0, 0);
                this.codeToSetup.setup(context, this.lib);
                this.currentCode = this.codeToSetup;
            },

            addCodeStringToEvaluate: function(codeString){
                return new Promise(function(resolve, reject){
                    canvasAnim.evaluateCode = function(){
                        evileval.evalAnimation(codeString, canvasAnim)
                            .then(function(){
                                resolve();
                            }, function(err){
                                console.log(err);
                                reject(err);
                            });
                    };
                });
            },
 
            loadAnimation : function(uri){
                var canvasAnim = this,
                    animationName = net.extractAnimationNameFromUri(uri);
                return net.HTTPget(uri).then(function(animCodeString){
                    canvasAnim.animationName = animationName;
                    canvasAnim.addCodeStringToEvaluate(animCodeString);
                    return animCodeString;
                });
            }
              
 
        };
        
        canvasAnim.setup();
        return canvasAnim;

    };

    var relativeCoordinates = {
        north : {row: -1, col: 0, opposite: "south"},
        south : {row: 1, col: 0, opposite: "north"},
        west : {row: 0, col: -1, opposite: "east"},
        east : {row: 0, col: 1, opposite: "west"}
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

    var createCellDiv = function(className, row, col, height, width){
        var cellDiv = document.createElement('div');
        cellDiv.id = className + "-" + row + "-" + col;
        cellDiv.className = className;
        cellDiv.style.top = (height * row)+"px";
        cellDiv.style.left = (width * col)+"px";
        
        document.getElementById('dashboard').appendChild(cellDiv);
        return cellDiv;
    };

    var makeIcon = function(classNames){
        var icon = document.createElement('span');
        icon.style.visibility = "hidden";
        icon.style.cursor = "pointer"; 
        icon.className = classNames;
        return icon;
    };
    
    var makeCellUi = function(row, col, height, width){
        var cellUi = createCellDiv("cellUi", row, col, height, width);
        var loadAnimationIcon = makeIcon("fa fa-folder-open-o fa-lg");
        cellUi.appendChild(loadAnimationIcon);
        return cellUi;
    };
    
    var addHintListeners = function(cells){
        var showGridHint = function(show){
            iter2d.forEach2dArray(cells, function(cell, row,col){
                (show ? csshelper.addClass : csshelper.removeClass)(cell.hint, "visible-grid");
            });
        };

        var onDashboardOver = function(e){  showGridHint(true);};
        var onDashboardOut = function(e){ showGridHint(false);};

        document.getElementById("dashboard").addEventListener("mouseover", onDashboardOver, false);
        document.getElementById("dashboard").addEventListener("mouseout", onDashboardOut, false);

    };

    var addCellUiListener = function(cellUi){
        var childNodes = cellUi.childNodes;
        cellUi.addEventListener("mouseover", function(e){
            for(var i = 0; i < childNodes.length; i++){
                childNodes[i].style.visibility = "visible";
            };
        });
        cellUi.addEventListener("mouseout", function(e){
            for(var i = 0; i < childNodes.length; i++){
                childNodes[i].style.visibility = "hidden";
            };
        });

    };


    var addEditor = function(exquis, makeEditorView, makeEditorController){
        exquis.editorController = makeEditorController(exquis, makeEditorView);
        
        iter2d.forEach2dArray(exquis.cells, function(cell){
            var edit = function(){ 
                if (exquis.targetCell) { csshelper.removeClass(exquis.targetCell.hint, "visible-cell"); }
                exquis.targetCell = cell;
                csshelper.addClass(exquis.targetCell.hint, "visible-cell");
                exquis.editorController.updateWithCanvasAnim(cell.canvasAnim);
                exquis.editorController.show();
            };

            var editIcon = makeIcon("fa fa-pencil-square-o fa-lg");
            editIcon.addEventListener('click', edit, false);
            cell.ui.appendChild(editIcon);
        });
        
        var possiblyHideEditor = function(event){
            if (event.target.tagName === "HTML"){
                // unselect edition
                exquis.editorController.hide();
                if (exquis.targetCell) { csshelper.removeClass(exquis.targetCell.hint, "visible-cell"); }
            }
        };
        document.addEventListener('click', possiblyHideEditor, true);
    };

    var init = function (assName, animCodes, makeEditorView, makeEditorController) {
        var container = document.getElementById("container"),
            exquis = {};
        exquis.assName = assName;

        exquis.cells = iter2d.map2dArray(animCodes,function(animCode,row,col){
            var height = 150,
                width = 150,
                cell = makeCellDom(row, col, height, width);
            cell.canvasAnim = makeCanvasAnimation(cell.context, animCode);
            addCellUiListener(cell.ui); 
            return cell;
        });
        
        
        addHintListeners(exquis.cells);
        
        exquis.assemblage = function(){
            var animationNames = iter2d.map2dArray(
                this.cells, 
                function(cell, row, col){
                    return cell.canvasAnim.animationName;
                });

            return animationNames;
        };

        var draw = function(){

            var allBorders = iter2d.map2dArray(exquis.cells,function(cell){ 
                return cell.canvasAnim.borders();
            });
            iter2d.forEach2dArray(exquis.cells,function(cell, row, col){
                var neighbouringBorders = {},
                    cells = exquis.cells,
                    canvasAnim = cell.canvasAnim;
                ["north", "south", "east", "west"].forEach(function(side){
                    var offset = relativeCoordinates[side];
                    var siderow = (row + offset.row + cells.length) % cells.length;
                    var sidecol = (col + offset.col + cells[0].length) % cells[0].length;
                    neighbouringBorders[side] = allBorders[siderow][sidecol][offset.opposite];
                    
                });

                if(canvasAnim.evaluateCode){
		           canvasAnim.evaluateCode();
		           delete(canvasAnim.evaluateCode);
                }

                try{
                    canvasAnim.draw(neighbouringBorders);
                }catch(e){
                    if(exquis.targetCell === cell ){
                        exquis.editorController.displayInvalidity(e);
                    }
                }
            });
        };

        setInterval(draw, 50);
        addEditor(exquis, makeEditorView, makeEditorController);
        return exquis;
    };


    return init;
    
});
