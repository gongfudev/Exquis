var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    index,
    exquis;
 
fs.readFile('./index.html', function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
});

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
	fetchFile(pathname, response);




}).listen(8000);

console.log("server on port 8000");