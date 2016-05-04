(function () {
    'use strict';
    var fs = require('fs'),
        path = require('path');
    module.exports =  {
        initConfigRoutes: function (app, route) {
//        API Routes to use
            var baseURL =  '/' + route;
            app.post(baseURL, post);
        }

    };


    function post(req, res) {
        var file;
        if (req.body.codigoAccionLlamadaModulo=="PR"){
            file = __dirname + '/json/nPropuesta.json';
        }else{
            file = __dirname + '/json/data.json';
        }


        return res.sendJSONFile(file);
    }




}());

