/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('TestController', TestController);

    TestController.$inject = ['$scope', 'TestService', '$rootScope', '$cookies', '$uibModal', '$timeout', '$location', 'PopupService'];
    function TestController($scope, TestService, $rootScope, $cookies, $uibModal, $timeout, $location, PopupService) {
        $scope.init = function () {
            
        };
        $scope.init();
    }
})();