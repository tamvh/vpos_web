var theApp = angular.module('theApp', ['ngRoute', 'ngCookies', 'smart-table', 'ui.bootstrap']);
theApp.constant('API_URL', API_URL); //define CONST API_URL

(function () {
    'use strict';
    
    theApp
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
    function config($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
        
            .when('/', {
                controller: 'PayController',
                templateUrl: 'pay/pay.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/' });
        
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    run.$inject = ['$rootScope'];
    function run($rootScope) {
	        
    }
})();
