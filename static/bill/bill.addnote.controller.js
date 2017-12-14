/* global theApp */

(function () {
    'use strict';
    theApp.controller('AddNoteController', AddNoteController);
    AddNoteController.$inject = ['$scope', '$rootScope', '$timeout', '$cookies', 'item', '$uibModalInstance'];
    function AddNoteController($scope, $rootScope, $timeout, $cookies, item, $uibModalInstance) {
        $scope.errItemCodeOverCharacter = false;
        $scope.notetext = '';
        $scope.item = item;
        $scope.typingItemNote = function () {
            console.log("tying: " + $scope.notetext + '');
            var typing = $scope.notetext + '';
            if (typing.length > 20) {
                typing = typing.substring(0, 19);
                $scope.notetext = typing;
                $scope.errItemCodeOverCharacter = true;
            } else {
                $scope.notetext = typing;
                $scope.errItemCodeOverCharacter = false;
            }
        };

        $scope.ok = function () {
            $scope.item.notetext = $scope.notetext;
            for (var i in $rootScope.foodItems) {
                if ($rootScope.foodItems[i].index === $scope.item.index) {
                    $rootScope.foodItems[i].notetext = $scope.notetext;
                    break;
                }
            }

            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };

        $scope.init = function () {
            console.log("item: " + JSON.stringify($scope.item));
            $scope.notetext = $scope.item.notetext;
            $scope.item_name = $scope.item.item_name;
            angular.element("#focusElement").focus();
        };

        $scope.init();
    }
})();