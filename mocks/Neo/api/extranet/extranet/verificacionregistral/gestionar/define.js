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

        if(!!req.query['_eventId']){
            res.sendJSONFile(__dirname + '/json/' + req.query['_eventId'] + '.json');
        }else{
            return res.sendJSONFile(__dirname + '/json/inicia.json');
        }
    }

}());
