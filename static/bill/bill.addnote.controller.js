/* global theApp */

(function(){
    'use strict';
    theApp.controller('AddNoteController', AddNoteController);
    AddNoteController.$inject = ['$scope', '$timeout', '$cookies', 'item', '$uibModalInstance'];
    function AddNoteController($scope, $timeout, $cookies, item, $uibModalInstance) {
        $scope.errItemCodeOverCharacter = false;
        $scope.item_code = '';
        $scope.item =  item;
        $scope.typingItemNote = function() {
            console.log("tying: " + $scope.item_code + '');
            var typing = $scope.item_code + '';
            if(typing.length > 20) {
                typing = typing.substring(0, 19);
                $scope.item_code = typing;
                $scope.errItemCodeOverCharacter = true;
            } else {
                $scope.item_code = typing;
                $scope.errItemCodeOverCharacter = false;
            }
        };
        
        $scope.ok = function() {
            $scope.item.note = $scope.item_code;
            var foods = $cookies.get("fooditems");
            if(foods + '' === '' || foods === 'undefined') {
                console.log("add item faile.");
            } else {
                $scope.l_product = JSON.parse(foods);
                for (var i in $scope.l_product) {
                    if($scope.l_product[i].index === $scope.item.index) {
                        $scope.l_product[i].note = $scope.item_code;
                        break;
                    }
                }
                $cookies.put("fooditems", JSON.stringify($scope.l_product));
            }
            $uibModalInstance.close(); 
        };
        
        $scope.cancel = function() {
            $uibModalInstance.close(); 
        };
        
        $scope.init = function() {
            console.log("item: " + JSON.stringify($scope.item));
            $scope.item_code = $scope.item.note;
            $scope.item_name = $scope.item.item_name;
            angular.element("#focusElement").focus();
        };
        
        $scope.init();
    }
})();