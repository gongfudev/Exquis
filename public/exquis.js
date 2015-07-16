"use strict";

define(["iter2d", "csshelper", "evileval", "net"], function(iter2d, csshelper, evileval, net){
            

    var makeCell = function(row, col, height, width){
        var canvas = makeCanvas(row, col, height, width), 
            context = canvas.getContext("2d"), 
            cell = {};
        cell.context = context;
        cell.hint = createCellDiv("hint", row, col, height, width);
        cell.ui = makeCellUi(row, col, height, width);
        return cell;
    };

    var addCellUiListeners = function(cellUi, store){
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
        addLoadAnimationHandler(cellUi.id, store); 
    };

    var makeCanvasAnimation = function(context){
        return {
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

            addCodeStringToEvaluate: function(codeString){
                var canvasAnim = this;
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
            },
            
            setAnimation: function(codeToSetup, uri){
                this.codeToSetup = codeToSetup;
                this.animationName = net.extractAnimationNameFromUri(uri),
                this.uri = uri;
                this.setup = function(){
                    // force reset matrix
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    this.codeToSetup.setup(context, this.lib);
                    this.currentCode = this.codeToSetup;
                };

                this.setup();
            }
        };
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

    var makeIcon = function(classNames, id){
        var icon = document.createElement('span');
        icon.style.visibility = "hidden";
        icon.style.cursor = "pointer"; 
        icon.className = classNames;
        if(id){
            icon.id = id;
        }
        return icon;
    };
    
    var loadIconSuffix = "-load-icon"; 
    var makeCellUi = function(row, col, height, width){
        var cellUi = createCellDiv("cellUi", row, col, height, width);
        var loadAnimationIcon = makeIcon("fa fa-folder-open-o fa-lg", cellUi.id + loadIconSuffix);
        cellUi.appendChild(loadAnimationIcon);
        return cellUi;
    };

    var addLoadAnimationHandler = function(cellUiId, store){
        var loadAnimationIcon = document.getElementById(cellUiId + loadIconSuffix);
        loadAnimationIcon.addEventListener('click', function(){
            store.loadAnimationList().then(function(fileUris){
                alert(fileUris);
            });
            //TODO display list in dialog
            //TODO load animation on canvasAnim
        });
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

            var editIcon = makeIcon("fa fa-pencil-square-o fa-lg", cell.ui.id + "-edit-icon");
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

    var init = function (assName, animUris, makeEditorView, makeEditorController, store) {
        var container = document.getElementById("container"),
            exquis = {};
        exquis.assName = assName;

        //TODO canvasAnim should have a method to load the source code from the url:
        // getSourceCodeString (which reads from the cache of the canvasAnim, or the store)
        // This becomes necessary when start to have code other than javascript
        exquis.cells = iter2d.map2dArray(animUris,function(animUri,row,col){
            var height = 150,
                width = 150,
                cell = makeCell(row, col, height, width);
            addCellUiListeners(cell.ui, store); 
            cell.canvasAnim = makeCanvasAnimation(cell.context);
            evileval.loadJsAnim(animUri).then(function(animationCodeClone){
                cell.canvasAnim.setAnimation(animationCodeClone, animUri);
            });
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
