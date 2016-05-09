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


    function get(req, res) {

        return res.send({});
    }




}());

