(function () {
    'use strict';
    angular
        .module('backoffice.core')
        .value('API', apiUrls());

    function apiUrls() {
        return {
            TABIT: '/tabit/',
            TAS: '/tas/api/',
            SUB: '/api/1.0/',
            SAP: '/api/1.0/'
        };
    }
})();