(function() {
    'use strict';
    
    angular
        .module('app.xxx')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'xxx/xxx.html',
                    controller: 'xxxCtrl',
                    controllerAs: 'vm',
                    title: 'XXX',
                }
            }
        ];
    }
})();
