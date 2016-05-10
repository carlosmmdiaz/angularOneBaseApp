(function() {
    'use strict';

    angular
        .module('app.core.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    routehelperConfig.$inject = ['$routeProvider'];
    // Must configure via the routehelperConfigProvider
    function routehelperConfig($routeProvider) {
        /* jshint validthis:true */
        this.config = {
            // These are the properties we need to set
             $routeProvider: $routeProvider
            // docTitle: ''
            // resolveAlways: {ready: function(){ } }
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    routehelper.$inject = [
        '$location', '$rootScope', '$route',
         'routehelperConfig'
    ];

    function routehelper(
        $location, $rootScope, $route,
         routehelperConfig) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors: 0,
            changes: 0
        };
        var routes = [];
        var $routeProvider = routehelperConfig.config.$routeProvider;

        var service = {
            configureRoutes: configureRoutes,
            getRoutes: getRoutes,
            routeCounts: routeCounts
        };

        init();

        return service;
        ///////////////

        function configureRoutes(routes) {
            routes.forEach(function(route) {
                route.config.resolve =
                    angular.extend(route.config.resolve || {}, routehelperConfig.config.resolveAlways);

                resolveDependencies(route.config);
                $routeProvider.when(route.url, route.config);
            });
            $routeProvider.otherwise({redirectTo: '/'});
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$routeChangeError',
                function() {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    //var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                       // 'unknown target';
                    //var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    //logger.warning(msg, [current]);
                    $location.path('/');
                }
            );
        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getRoutes() {
            for (var prop in $route.routes) {
                if ($route.routes.hasOwnProperty(prop)) {
                    var route = $route.routes[prop];
                    var isRoute = !!route.title;
                    if (isRoute) {
                        routes.push(route);
                    }
                }
            }
            return routes;
        }

        function updateDocTitle() {
            $rootScope.$on('$routeChangeSuccess',
                function(event, current) {
                    routeCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = routehelperConfig.config.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
        function resolveDependencies(config) {
            var dependencies=config.resolve.deps;
            if (!dependencies || dependencies.length === 0) {
                return;
            }
            config.resolve.deps = ['$q', '$rootScope',
                function ($q, $rootScope) {
                    var deferred = $q.defer();
                    $script(dependencies, function () {
                        $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }];
        }
    }
})();