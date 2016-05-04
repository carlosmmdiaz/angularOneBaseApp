(function() {
    'use strict';
    angular
        .module('app.xxx')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/xxx',
                config: {
                    templateUrl: 'xxx.html',
                    controller: 'xxxCtrl',
                    controllerAs: 'vm',
                    title: 'XXX',
                }
            }
        ];
    }
})();
