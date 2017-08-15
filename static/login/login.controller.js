/* global theApp */

(function () {
    'use strict';

    theApp.controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', 'LoginService', '$rootScope', '$uibModal', '$timeout', '$location', 'PopupService'];
    function LoginController($scope, LoginService, $rootScope, $uibModal, $timeout, $location, PopupService) {
        
        $scope.init = function () {
            alert('login');
        };
        $scope.init();
    }
})();