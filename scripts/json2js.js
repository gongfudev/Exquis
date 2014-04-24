

var fs = require('fs'),
    requirejs = require('requirejs'),
    targetDirectory = 'public/animations',
    baseUrl = 'public';


requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    baseUrl: baseUrl
});

requirejs(['evileval'], function(evileval) {
   fs.readdirSync(targetDirectory)
        .filter(function(path){ return path.match(/.json$/); })
        .forEach(function(path){
            var string = fs.readFileSync(targetDirectory + '/' + path),
                jsonObject = JSON.parse(string),
                jsString = evileval.stringifyJSON(jsonObject),
                savePath = targetDirectory + '/' + path.substr(0, path.length - 2);

           fs.writeFileSync(savePath, jsString);
            
        });

    console.log("all done");
});

