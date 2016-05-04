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

        switch (req.query._eventId){
            case "guardarDatosInstrumentacion":
                return res.sendJSONFile(__dirname + '/json/event-guardarDatosInstrumentacion.json');
                break;
            default :
                return res.sendJSONFile(__dirname + '/json/inicio.json');
        }

    }

}());

