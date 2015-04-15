var http = require('http'),
    request = require('request'),
    createListener = require('./create-listener.js');

var testServer = function (){
    var port = Number(process.env.PORT || 8000);
    var server = http.createServer(createListener());
    server.listen(port);
    console.log("server on port "+port);
    request
        .get('http://localhost:' + port)
        .on('response', function(response) {
            console.log(response.statusCode); // 200
            console.log(response.headers['content-type']); // 'image/png'
            server.close();
        });
};

testServer();
