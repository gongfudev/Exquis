"use strict";

define(["net",
        "iter2d",
        "editorController",
        "csshelper",
        "evileval"], function(net, iter2d, makeEditorController, csshelper, evileval){
            

    var makeCell = function(row, col, height, width, animationCode, exquis){
        var canvas = makeCanvas(row, col, height, width), 
            context = canvas.getContext("2d"), 
            cell = {};

        cell.canvasAnim = makeCanvasAnimation(context, animationCode, exquis);
        cell.hint = makeHint(row, col, height, width);

        return cell;
    };

    var makeCanvasAnimation = function(context, animationCode, exquis){
        var isJsAnim = true; 
        var canvasAnim = {
            animationToSetup : animationCode.animationToSetup,
            animationName: animationCode.animationName,
            uri: animationCode.uri,
            currentAnimation: null,
            borders : function(){
               return {
                    north: context.getImageData(0, 0, context.canvas.width, 1),
                    south: context.getImageData(0, context.canvas.height - 1, context.canvas.width, 1),
                    east: context.getImageData(context.canvas.width - 1, 0, 1 , context.canvas.height),
                    west: context.getImageData(0, 0, 1, context.canvas.height - 1)
                };
            },

            draw : function(borders){
                if(!this.currentAnimation){
                    return;
                }

                // force reset matrix
                context.setTransform(1, 0, 0, 1, 0, 0);
                if(this.currentAnimation.draw){
                    this.currentAnimation.draw(context, borders, this.lib);
                }
            },

            setup : function(){
                // force reset matrix
                context.setTransform(1, 0, 0, 1, 0, 0);
                this.animationToSetup.setup(context, this.lib);
                this.currentAnimation = this.animationToSetup;
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

    var makeHint = function(row, col, height, width){
        var gridHint = document.createElement('div');
        gridHint.id = "hint-" + row + "-" + col;
        gridHint.className = "hint";
        gridHint.style.top = (height * row)+"px";
        gridHint.style.left = (width * col)+"px";

        document.getElementById('dashboard').appendChild(gridHint);
        return gridHint;
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


    var init = function (assName, animCodes) {
        var container = document.getElementById("container"),
            exquis = {};
        exquis.assName = assName;

        exquis.cells = iter2d.map2dArray(animCodes,function(animCode,row,col){
            var height = 150,
                width = 150;
            return makeCell(row, col, height, width, animCode, exquis);
        });
        
        exquis.editorController = makeEditorController(exquis);
        exquis.addEditorView = function(makeEditorView){
            var that = this;
            that.editorView = makeEditorView(that.editorController);
            iter2d.forEach2dArray(that.cells, function(cell){
                var edit = function(){ 
                    if (that.targetCell) { csshelper.removeClass(that.targetCell.hint, "visible-cell"); }
                    that.targetCell = cell;
                    csshelper.addClass(that.targetCell.hint, "visible-cell");
                    that.editorController.updateWithCanvasAnim(cell.canvasAnim);
                };
                cell.hint.addEventListener('click', edit, false);
            });
            
            var toggleEditorView = function(event){
                if (event.target.tagName === "HTML"){
                    // unselect edition
                    that.editorView.hide();
                    if (that.targetCell) { csshelper.removeClass(that.targetCell.hint, "visible-cell"); }
                }else{
                    that.editorView.show();
                }
            };
            document.addEventListener('click', toggleEditorView, true);
        };
        
        addHintListeners(exquis.cells);
        
        exquis.assemblage = function(){
            var animationNames = iter2d.map2dArray(this.cells, function(cell, row, col){
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
                
                if(canvasAnim.updateDraw){
		    canvasAnim.updateDraw(neighbouringBorders);
		    delete(canvasAnim.updateDraw);
                }else{
		    canvasAnim.draw(neighbouringBorders);
                }
            });
        };

        setInterval(draw, 50);
        return exquis;
    };


    return init;
    
});
