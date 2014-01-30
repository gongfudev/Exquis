var define = function(first, other){
     var ifirst = first(),
         iother = other();

  // if only draw has changed -> copy draw to existing animation
  // else -> replace old animation and call setup
  console.log("all same: "+(first.toString() == other.toString()));
  console.log("draw same: "+(ifirst.draw.toString() == iother.draw.toString()));
  console.log("rest same: "+(toStringWithoutDraw(first) == toStringWithoutDraw(other)));
  console.log("--");

}

var toStringWithoutDraw = function(func){
  var everything = func.toString().replace(/[\s\n]+/g,""),
      draw = func().draw.toString().replace(/[\s\n]+/g,"");
  without =  everything.replace(draw,"");
  console.log(without);
  return without;
};

var original = function(){
  var bobo = "aie";
  return {draw: function(bei,agoi){ console.log("poum "+bobo);},
          setup: function(){var b = 10}};
};

var copy = function(){
  var bobo =  "aie";
  return {draw: function(bei,agoi){ console.log("poum "+bobo);},
          setup: function(){var b = 10}};
};

var modDraw = function(){
  var bobo = "aie";
  return {draw: function(bei,agoi){ console.log("paf "+bobo);},
          setup: function(){var b = 10}};
};

var modClo = function(){
  var bobo = "aye";
  return {draw: function(bei,agoi){ console.log("poum "+bobo);},
          setup: function(){var b = 10}};
};

define(original, copy);
define(original, modDraw);
define(original, modClo);


