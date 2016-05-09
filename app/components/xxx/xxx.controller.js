(function() {
    'use strict';
    angular
        .module('app')
        .controller('xxxCtrl', controller);

    /* @ngInject */
    function controller() {
        var vm = this;

        // Public functions:
        function init() {
           console.log('test');
        }
        init();

    }
}());
