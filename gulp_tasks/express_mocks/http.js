'use strict';

exports = module.exports = servidorHttp;

function servidorHttp(){
    var express = require('express'),
        srv = require('./app.js')(),
        app = express(),
        neo = express();

    app.set('port', '8080');

    for(var i=0; i<srv.length; i++) {
        var port = (srv[i].env.mockPort)? srv[i].env.mockPort : false,
            servAPI=srv[i].server;
        if (!port || app.get('port')===port) {
            app.use(servAPI);
        } else {
            servAPI.listen(servAPI.get('port'), function() {
            });
            console.log('\nExpress server listening on: ' +servAPI.get('host') + ':' + servAPI.get('port'));
        }
        console.log(port);
    }

    var serv = app.listen(app.get('port'), function() {
        console.log('\nExpress Mock server listening on port ' + app.get('port'));
    });


    var https = require('https');
    neo.use('/',express.static('./express_mocks/Neo/localhost'));

    var certs = {
        key: '',
        ca: '',
        cert: ''
    };

    var httpsServer = https.createServer(certs, neo);
    httpsServer.listen(40010);
    neo.listen(40009,function(){});

    return serv;
}