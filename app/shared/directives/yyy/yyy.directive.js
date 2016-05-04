(function(){
    'use strict';
    angular
        .module('app.directive.xxx', [])
        .directive('xxx', controller);
    
    function controller() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '../shared/directives/xxx/xxx.directive.html',
            controller:xxxCrtl,
            controllerAs: 'vmd',
            bindToController: true,
            scope: {
            }
        };
        function xxxCrtl() {
            var vm = this;
        
            function init() {

            }
            init();
        }
    }
}());
