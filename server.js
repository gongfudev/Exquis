var http = require('http'),
    createListener = require('./create-listener.js');

var startServer = function (){
    var port = Number(process.env.PORT || 8000);
    http.createServer(createListener()).listen(port);
    console.log("server on port "+port);
};

startServer();
