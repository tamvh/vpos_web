/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('BillController', BillController);

    BillController.$inject = ['$scope', 'BillService', '$rootScope', '$uibModal', '$timeout', '$location'];
    function BillController($scope, BillService, $rootScope, $uibModal, $timeout, $location) {
        $scope.l_product = [];
        $scope.total_money = 0;
        $scope.init = function() {
            $scope.l_product = $rootScope.globals.listItemSelected;
            var t_moey = 0;
            for(var i in $scope.l_product) {
                t_moey = t_moey + $scope.l_product[i].amount;
            }
            $scope.total_money = t_moey;
        };
        $scope.init();
        
        $scope.back = function() {
            $location.path("/");
        };
    }
})();