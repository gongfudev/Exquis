
var toStringWithoutDraw = function(func){
  var everything = func.toString().replace(/[\s\n]+/g,""),
      draw = func().draw.toString().replace(/[\s\n]+/g,"");
  without =  everything.replace(draw,"");
  console.log(without);
  return without;
};

var animation =  {
    libs:{"bibs/gameOfLife":"gameLife", "mf/asdfa": "ass"},
    draw: function(bei,agoi){ console.log("poum");},
    setup: function(){var b = 10;}
};

var stringify = function(animation){
    var libs = animation.libs,
        string = "{libs:{",
        libsContent = [];
    for(property in libs){
        if(libs.hasOwnProperty(property)){
            libsContent.push( "\"" + property + "\":\"" + libs[property] +"\"");
        }
    }
    string += libsContent.join(", ") + "},\n";
    string += "draw: " + animation.draw.toString() + ",\n";
    string += "setup: " + animation.setup.toString() + "}";
    return string;
};

console.log(stringify(animation));
