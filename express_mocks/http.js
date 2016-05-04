exports = module.exports = servidorHttp;


function servidorHttp(type){
    var express = require('express'),
        dirStyle = express(),
        dirBower= express(),
        dirLibs= express(),
        dirImg= express(),
        dirScripts= express(),
        dirI18n= express(),
        app = express(),
        proxyMiddleware = require('http-proxy-middleware'),
        dirLang ='/es',
        dirServer='./app/'+(type==='dist'?'dist':'/devTmp'),
        proxy;


    var srv = require('./app.js')();


    // var dirconstants
    dirStyle.use(express.static(dirServer+'/styles'));
    dirBower.use(express.static('./app/bower_components'));
    dirLibs.use(express.static('./app/libs'));
    dirImg.use(express.static('./app/images'));
    dirScripts.use(express.static('./app/scripts'));
    dirI18n.use(express.static('./app/i18n'));


    app.use('/',express.static(dirServer+dirLang));
    app.set('port', '8080');

    app.use('/styles',dirStyle);
    app.use('/bower_components',dirBower);
    app.use('/libs',dirLibs);
    app.use('/images',dirImg);
    app.use('/scripts',dirScripts);
    app.use('/i18n',dirI18n);

    if (type=="epd"){
        var context=['/api','/tabit'];
        //var options = {
        //    target: 'https://www.gestorias-epd.cm.es', // target host
        //    changeOrigin: true,               // needed for virtual hosted sites
        //    ws: true,                         // proxy websockets
        //    //pathRewrite: {
        //    //    '^/old/api' : '/new/api'      // rewrite paths
        //    //},
        //    proxyTable: {
        //        // when request.headers.host == 'dev.localhost:3000',
        //        // override target 'http://www.example.org' to 'http://localhost:8000'
        //        'localhost:8080' : 'https://www.gestorias-epd.cm.es'
        //    }
        //};
    //proxy = proxyMiddleware(context, options);
    //var url = require('url');
    //proxy = require('proxy-middleware');
    //app.use('/api', proxy(url.parse('https://www.gestorias-epd.cm.es/api')));

        //proxy = proxyMiddleware('/api', {target: 'https://www.gestorias-epd.cm.es/api'});
        //app.use(proxy);
        //proxy = proxyMiddleware('/tabit', {target: 'https://www.gestorias-epd.cm.es/tabit'});
        //app.use(proxy);
    }else{
        for(var i=0;i<srv.length;i++){
            var port = (srv[i].env.mockPort)? srv[i].env.mockPort : false,
                servAPI=srv[i].server;
            if (!port || app.get('port')===port){
                app.use(servAPI);
            }else{
                servAPI.listen(servAPI.get('port'), function() {
                });
                console.log('\nExpress server listening on: ' +servAPI.get('host') + ':' + servAPI.get('port'));
            }
            console.log(port);
        }
    }



    var serv = app.listen(app.get('port'), function() {
        console.log('\nExpress Mock server listening on port ' + app.get('port'));
    });

    var neo =express();

    var https = require("https");
    neo.use('/',express.static('./mocks/Neo/localhost'));
    //neo.listen('40010', function() {
    //    console.log('\nMock server loacl NEO: 40010');
    //});

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
