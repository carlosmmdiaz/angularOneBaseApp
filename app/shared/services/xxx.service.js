(function() {
    'use strict';
    angular
        .module('app')
        .service('xxxSrv', service);

        function service() {

            var service = {
                get: get
            };

            return service;

            function get() {
                return '';
            }
        }
}());