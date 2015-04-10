var http = require('http'),
    requestListener = require('./request-listener.js');

var startServer = function (){
    var port = Number(process.env.PORT || 8000);
    http.createServer(requestListener).listen(port);
    console.log("server on port "+port);
};

startServer();
