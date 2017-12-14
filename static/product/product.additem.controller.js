/* global theApp */

(function () {
    'use strict';
    theApp.controller('AddItemController', AddItemController);
    AddItemController.$inject = ['$scope', '$rootScope', '$timeout', '$cookies', '$location', 'item', '$uibModalInstance', 'PopupService'];
    function AddItemController($scope, $rootScope, $timeout, $cookies, $location, item, $uibModalInstance, PopupService) {
        $scope.item_name = '';
        $scope.price = 1;
        $scope.img_path = 'img/noimg.png';
        $scope.quantity = 1;
        $scope.disable_thanhtoan = false;
        $scope.item = item;
        $scope.ok = function () {
            console.log(JSON.stringify($scope.item));
            for (var i in $rootScope.l_pro) {
                if ($rootScope.l_pro[i].item_id === $scope.item.item_id) {
                    if ($scope.item.quantity > 0) {
                        $scope.item.img = $scope.item.img_checked;
                        $scope.item.show_quantity = true;
                        var _find = true;
                        var _item = {
                            index: $scope.item.item_id,
                            item_name: $scope.item.item_name,
                            quantity: $scope.quantity,
                            price: $scope.item.price,
                            showaction: true,
                            amount: $scope.quantity * $scope.item.price,
                            original_price: 0.0,
                            promotion_type: 0.0,
                            notetext: ''
                        };

                        for (var j in $rootScope.foodItems) {
                            if ($rootScope.foodItems[j].index === $scope.item.item_id) {

                                $rootScope.foodItems[j].quantity = $scope.quantity;
                                $rootScope.foodItems[j].amount = $rootScope.foodItems[j].quantity * $rootScope.foodItems[j].price;
//                                $cookies.put("fooditems", JSON.stringify($rootScope.foodItems));
                                _find = false;
                                break;
                            }
                        }
                        if (_find) {
                            $rootScope.foodItems.push(_item);
//                            $cookies.put("fooditems", JSON.stringify($rootScope.foodItems));
                        }
                    } else {
                        // quantity <= 0
                        $scope.item.img = $scope.item.img_path;
                        $scope.item.show_quantity = false;
                        for(var k in $rootScope.foodItems) {
                            if ($scope.item.item_id === $rootScope.foodItems[k].index) {
                                $rootScope.foodItems.splice(k, 1);
                                break;
                            }
                        }
                        
//                        $cookies.put("fooditems", JSON.stringify($rootScope.foodItems));
                    }
                    $scope.gettotal_money();
                    $rootScope.l_pro[i] = $scope.item;
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
            $scope.item_name = $scope.item.item_name;
            $scope.price = $scope.item.price;
            $scope.img_path = $scope.item.img_path;
            var qt = 0;
            if ($scope.item.quantity.toString() !== "") {
                var qt = $scope.item.quantity;
            }
            $scope.quantity = qt;
            if (qt > 0) {
                $scope.disable_thanhtoan = false;
            } else {
                $scope.disable_thanhtoan = true;
            }
        };
        $scope.init();

        $scope.plus = function () {
            $scope.quantity += 1;
            $scope.item.quantity = $scope.quantity;
            $scope.disable_thanhtoan = false;
        };

        $scope.minus = function () {
            console.log("minus quantity");
            if ($scope.quantity > 0) {
                $scope.quantity -= 1;
                $scope.item.quantity = $scope.quantity;
            }
            if ($scope.quantity <= 0) {
                $scope.disable_thanhtoan = true;
            } else {
                $scope.disable_thanhtoan = false;
            }
        };

        $scope.gettotal_money = function () {
            var _soluong = 0;
            var _amount = 0;
            var _price = 0;
            var _total_amount = 0;

//            var foods = $cookies.get("fooditems");
//            console.log('food: ' + foods);
//            var arr_food = [];
//            if (foods + '' !== '' && foods + '' !== 'undefined') {
//                arr_food = JSON.parse(foods);
//                $rootScope.foodItems = arr_food;
//            }
            console.log('FOOD ITEMS: ' + JSON.stringify($rootScope.foodItems));
            for (var j in $rootScope.foodItems) {
                _soluong = $rootScope.foodItems[j].quantity;
                _price = $rootScope.foodItems[j].price;
                _amount = _price * _soluong;
                _total_amount = _total_amount + _amount;
            }
            $rootScope.totalmoney = _total_amount;
            
//            $cookies.put("totalmoney", $rootScope.totalmoney);
        };
        $scope.bill = function () {
            $scope.ok();
            $uibModalInstance.close();
            if ($rootScope.foodItems.length > 0) {
//                $cookies.put("fooditems", JSON.stringify($rootScope.foodItems));
                $rootScope.globals.listItemSelected = $rootScope.foodItems;
                $rootScope.globals.tablenumber = $scope.tablenumber;
                $rootScope.globals.tablelocation = $scope.tablelocation;
                $location.path("/bill");
                
            } else {
                PopupService.displayPopup('Bạn vui lòng chọn sản phẩm trước khi thanh toán.');
            }
        };
    }
})();