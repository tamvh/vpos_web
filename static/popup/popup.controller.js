/* global theApp */

(function(){
    'use strict';
    theApp.controller('PopupCtrl', PopupCtrl);
    PopupCtrl.$inject = ['$scope', 'msg', '$timeout', '$uibModalInstance'];
    function PopupCtrl($scope, msg, $timeout, $uibModalInstance) {
        $scope.msgList = [];

        $scope.clearMsg = function () {
            $scope.cancel();
            $scope.msgList = [];
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.showMsg = function (msg) {
            $scope.msgList = [{type: 'success', content: msg}];
            $timeout($scope.cancel, 5000);
        };

        $scope.showMsg(msg);
        $scope.init = function ()
        {
            $scope.popupMsg = msg;
        };
        $scope.init();
    }
})();