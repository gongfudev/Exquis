var fs = require('fs'),
    rootStaticFiles = './public/';

var fetchFile = function(fileName, response) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
	    console.log(err);
	    response.writeHeader(404);
	    // this crashes the server in some macs...
	    //response.write(err.toString());
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
    }else if(/.+\.css$/.test(fileName)) {
        return {"Content-Type": "text/css"};
    }else {
	return {"Content-Type": "text/html"};
    }
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
		console.log("The file was saved!" + pathname);
		response.writeHead(200, "OK", {'Content-Type': 'text/html'});
		response.end();
	    }
	});
    });
};

var readDirectory = function (path, response){

    fs.readdir(path, function(err, files){
        if(err) {
	    console.log(err);
	    response.writeHead(500, "OUPS", {'Content-Type': 'text/html'});
	    response.end();
	} else {
	    response.writeHeader(200, {'Content-Type': 'application/json'});
	    response.write(JSON.stringify(files));
	    response.end();
        }	
    });
};

module.exports = function(request, response) {

    var pathname = require('url').parse(request.url).pathname;
    console.log("get me "+pathname);

    var dirRegex = /^\/(animations|assemblages)\/$/,
        matchingDir = pathname.match(dirRegex);
    
    if(matchingDir && request.method === "GET"){
        readDirectory(rootStaticFiles + matchingDir[0], response);
    }else if (request.method === "GET"){
        if (pathname === "/" || pathname.substr(0,12) === "/assemblage/"){
	    pathname = "/index.html";
        }
	fetchFile(rootStaticFiles + pathname, response);
    }else if (request.method === "POST"){
	saveFile(request, response, rootStaticFiles + pathname);
    }else{
        response.writeHeader(501);
        response.end();
    }
    
};

