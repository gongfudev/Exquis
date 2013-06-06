var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    exquis;
 


var fetchFile = function(fileName, response) {
	fs.readFile(fileName, function (err, data) {
	    if (err) {
	    	console.log(err);
		    response.writeHeader(404);
		    response.write(err.toString());
	    }else{
		var contentType = guessContentType(fileName);
		console.log(fileName+" "+contentType["Content-Type"]);
		response.writeHeader(200, contentType);
		response.write(data);
	    }
	    response.end();
	});
};

var guessContentType = function(fileName){
	if(/.+\.js$/.test(fileName)){
		return {"Content-Type": "text/javascript"};
	}else if(/.+\.json$/.test(fileName)){
		return {"Content-Type": "application/json"};
	}else{
		return {"Content-Type": "text/html"};
	}
};


var listAnimations = function(readCallback){
    fs.readdir("./animations", readCallback);
};

var saveFile = function(request, response, pathname){
    
    var fullBody = '';
    
    request.on('data', function(chunk) {
	fullBody += chunk.toString();
    });
    
    request.on('end', function() {
	// empty 200 OK response for now
	
	fs.writeFile(pathname, decodeURIComponent(fullBody), function(err) {
	    if(err) {
		console.log(err);
		response.writeHead(500, "OUPS", {'Content-Type': 'text/html'});
		response.end();
	    } else {
		console.log("The file was saved!");
		response.writeHead(200, "OK", {'Content-Type': 'text/html'});
		response.end();
	    }
	});
    });
};

var startServer = function (allowTests){
    http.createServer(function(request, response) {

        var pathname = require('url').parse(request.url).pathname;

        if( !allowTests && pathname.substr(0,7) === "/tests/"){
            response.writeHeader(403);
	    response.end();
        }
    
        if (pathname === "/" || pathname.substr(0,12) === "/assemblage/"){
	    pathname = "/index.html";
        }else if(pathname === "/animations/"){
	
	    listAnimations(function(err, files){
	        response.writeHeader(200, {'Content-Type': 'application/json'});
	    
	        response.write(JSON.stringify(files));
	        response.end();
	    });
        }

        pathname = "." + pathname;

        if (request.method === "GET"){
	    fetchFile(pathname, response);
        }else if (request.method === "POST"){
	    saveFile(request, response, pathname);
	
        }
    
    }).listen(8000);

    console.log("server on port 8000");
};

var allowTests = process.argv.indexOf("test") > 0;
if (allowTests){
    console.log("server started in testing mode");
}
startServer(allowTests);
