(function() {
    'use strict';
    angular
        .module('app.xxx')
        .controller('xxxCtrl', controller);

    /* @ngInject */
    function controller($http) {
        var vm = this;

        // Public functions:
        function init() {
            console.log('Hello world');
            $http.post('/mock').then(function(data) {
                console.log(data);
            });
        }
        init();

    }
}());
