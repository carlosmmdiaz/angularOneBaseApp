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

        switch (req.body.codigoAccionLlamadaModulo){
            case "PR":
                file = __dirname + '/json/nPropuesta.json';
                break;
            case "TR":
                file = __dirname + '/json/nombrePropuesta.json';
                break;
            default:
                file = __dirname + '/json/data.json';
                break;
        }

        return res.sendJSONFile(file);
    }




}());

