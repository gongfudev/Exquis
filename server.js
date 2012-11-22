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
		    response.writeHeader(200, guessContentType(fileName));
		    response.write(data);
	    }
	    response.end();
	});
}

var guessContentType = function(fileName){
	if(/.+\.js$/.test(fileName)){
		return {"Content-Type": "text/javascript"};
	}else if(/.+\.json$/.test(fileName)){
		return {"Content-Type": "application/json"};
	}else{
		return {"Content-Type": "text/html"};
	}
}

http.createServer(function(request, response) {

	var pathname = "." + require('url').parse(request.url).pathname;

	if (request.method === "GET"){
		fetchFile(pathname, response);
	}else if (request.method === "POST"){
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
	}
	
}).listen(8000);

console.log("server on port 8000");