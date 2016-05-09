
var fs = require('fs'),
    path = require('path');
        servers=[];

exports = module.exports = servidores;

function servidores (){


    var path = require('path'),
        pathDir = path.resolve('.'),
        pathAPIs= './gulp_tasks/express_mocks/config/RestAPIs',
        dirs = fs.readdirSync(pathAPIs);


    dirs.forEach(function (file) {
        var fileName = path.basename(file, '.js');
        exports[fileName] = require('./config/RestAPIs/'+ fileName );

        if (typeof ( exports[fileName] ) === 'object'&& exports[fileName].express ) {
            initExpressRestAPI(pathDir, exports[fileName]);
        }
    });

    return servers;

}


function initExpressRestAPI (pathRoot,env) {
    var express = require('express'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        app = express(),
        srv;

    //app.request.sendJSONFile = sendJSONFile;

    app.use(cookieParser());

    app.use(function (req, res, next) {
        res.sendJSONFile = sendJSONFile;
        res.cookie('SSO_TGT_NS','aaaaa');

        //console.log('cookie SSO_TGT_NS have created successfully');
        next();
    });
    app.locals.title = env.express.title;

    app.use(express.static(pathRoot || '.'));
    app.set('port', env.express.mockPort );
    app.set('host',env.express.mockHost);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));


    console.log('\nURLs on RestAPI: ' +app.get('host') + ':' + app.get('port'));



    initConfigRoutes(app,env.express.mockDir,env.express);
    srv ={server:app,env:env.express};
    servers.push(srv);
}

function initConfigRoutes(app, moskURI, fileConfig) {
//        API Routes to use
    var rootPath=require('path').resolve('.') + fileConfig.path + moskURI ,
        files = fs.readdirSync(  rootPath),
        fileDefine=rootPath+'define.js',
        fileStat;

    try {
        fileStat = fs.lstatSync(fileDefine);
        console.log("REstAPI URL: http://"+ fileConfig.mockHost+':'+fileConfig.mockPort+'/'+ fileConfig.mockURL+ moskURI.substr(fileConfig.mockDir.length) );
        exports[moskURI] = require('./'+moskURI+'define');
        exports[moskURI].initConfigRoutes(app, fileConfig.mockURL+ moskURI.substr(fileConfig.mockDir.length) );
    }catch(e){}


    files.forEach(function (file) {
        if (fs.lstatSync(rootPath + file).isDirectory()) {
            initConfigRoutes(app,moskURI+file+'/',fileConfig)
        }

    });
}

function sendJSONFile(file){

    var filePath=path.resolve(file);


    var response=JSON.parse(fs.readFileSync(filePath, 'utf8'));
    //response="";
    //fs.readFileSync(filePath, 'utf8').toString().split('\r\n').forEach(function (line) {
    //    response+= line.toString() ;
    //});

    return this.json(response);
}