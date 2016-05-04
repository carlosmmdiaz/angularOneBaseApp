(function () {
    'use strict';
    var fs = require('fs'),
        path = require('path');
    module.exports =  {
        initConfigRoutes: function (app, route) {
//        API Routes to use
            var baseURL =  '/' + route;
            app.get(baseURL, get);


        }

    };

    function get(req, res){
        //res.sendJSONFile(__dirname + '/json/lineasRiesgo.json');
        res.sendJSONFile(__dirname + '/json/'+req.query.queryType + '.json');

    }
}());

