/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', 'ProductService', '$rootScope', '$location', 'PopupService'];
    function ProductController($scope, ProductService, $rootScope, $location, PopupService) {
        $scope.listProduct = [];
        $scope.order = {};
        $scope.zptranstoken = "";
        $scope.appid = 0;
        $scope.l_pro = [];
        $scope.total_money = 0;
        $scope.table_number = "#";
        $scope.table_location = "#";
        var foodItems = [];
        var img_host = "";
        function get_params() {
            var cur_url = window.location.href;
            if (cur_url.split('?').length === 2) {
                var params = cur_url.split('?')[1];
                if (params.split('=').length === 2) {
                    var dt = params.split('=')[1];
                    var json_obj = JSON.parse(decodeURI(dt));
                    $scope.table_number = json_obj.table_number;
                    $scope.table_location = json_obj.table_location;
                }
            }
        }
        $scope.getListProduct = function () {
            initJsBrige();
            ZaloPay.showLoading();
            get_params();
            ProductService.getListProduct()
                    .then(function (response) {
                        if (response.err === 0) {
                            $scope.l_pro = response.dt.items;
                            img_host = response.dt.img_host;
                            for (var i in $scope.l_pro) {
                                $scope.l_pro[i].bgcolor = "white";
                                if ($scope.l_pro[i].item_name.length > 25) {
                                    $scope.l_pro[i].name_view = $scope.l_pro[i].item_name.toString().substr(0, 24) + "...";
                                } else {
                                    $scope.l_pro[i].name_view = $scope.l_pro[i].item_name;
                                }

                                $scope.l_pro[i].quantity = "";
                                $scope.l_pro[i].icon_minus = "";
                                $scope.l_pro[i].icon_plus = "";
                                $scope.l_pro[i].img_path = img_host + $scope.l_pro[i].img_path;
                                $scope.l_pro[i].img_checked = "img/checked.png";
                                $scope.l_pro[i].img = $scope.l_pro[i].img_path;
                            }
                        } else if (response.err === 101) {      // has not logged in
                            $location.path('/login');
                        } else {
                            console.log("error getListProduct");
                        }
                    });
            ZaloPay.hideLoading();
        };
        $scope.getListProduct();

        $scope.selectItem = function (item) {
            console.log("===select item===");
            for (var i in $scope.l_pro) {
                if ($scope.l_pro[i].item_id === item.item_id) {
                    if (item.quantity === "") {
                        item.quantity = 0;
                    }
                    $scope.l_pro[i].bgcolor = "#E0E0E0";
                    $scope.l_pro[i].img = $scope.l_pro[i].img_checked;
                    var item_quantity = item.quantity + 1;
                    var item_amount = item.price * item_quantity;
                    var _find = true;
                    $scope.l_pro[i].quantity = item_quantity;
                    $scope.l_pro[i].icon_minus = "-";
                    $scope.l_pro[i].icon_plus = "+";
                    var _item = {
                        index: item.item_id,
                        item_name: item.item_name,
                        quantity: item_quantity,
                        price: item.price,
                        amount: item_amount,
                        original_price: 0.0,
                        promotion_type: 0.0
                    };

                    for (var j in foodItems) {
                        if (foodItems[j].index === item.item_id) {
                            foodItems[j].quantity = foodItems[j].quantity + 1;
                            foodItems[j].amount = foodItems[j].quantity * foodItems[j].price;
                            $scope.total_money = $scope.total_money + foodItems[j].amount - ((foodItems[j].quantity - 1) * foodItems[j].price);
                            _find = false;
                            break;
                        }
                    }
                    if (_find) {
                        foodItems.push(_item);
                        $scope.total_money = $scope.total_money + _item.amount;
                    }
                    break;
                }
            }
        };

        $scope.deleteItem = function (item) {
            var _find = false;
            for (var i in foodItems) {
                if (item.item_id === foodItems[i].index)
                {
                    for (var j in $scope.l_pro) {
                        if ($scope.l_pro[j].item_id === item.item_id) {
                            $scope.l_pro[j].bgcolor = "white";
                            $scope.l_pro[j].img = $scope.l_pro[j].img_path;
                            $scope.l_pro[j].quantity = "";
                            $scope.l_pro[j].icon_minus = "";
                            $scope.l_pro[j].icon_plus = "";
                            break;
                        }
                    }
                    $scope.total_money = $scope.total_money - foodItems[i].amount.toString();
                    foodItems.splice(i, 1);
                    _find = true;
                    break;
                }
            }
            if (!_find) {
                $scope.selectItem(item);
            }
        };

        $scope.change_quantity = function (_math, item) {
            if (_math === "-") {
                for (var i in foodItems) {
                    if (item.item_id === foodItems[i].index)
                    {
                        $scope.total_money = $scope.total_money - foodItems[i].amount;
                        foodItems.splice(i, 1);
                        for (var j in $scope.l_pro) {
                            if ($scope.l_pro[j].item_id === item.item_id) {
                                if ($scope.l_pro[j].quantity === 1) {
                                    $scope.l_pro[j].quantity = "";
                                    $scope.l_pro[j].bgcolor = "white";
                                    $scope.l_pro[j].img = $scope.l_pro[j].img_path;
                                    $scope.l_pro[j].icon_minus = "";
                                    $scope.l_pro[j].icon_plus = "";
                                    break;
                                }
                                $scope.l_pro[j].bgcolor = "#E0E0E0";
                                $scope.l_pro[j].img = "img/checked.png";
                                $scope.l_pro[j].quantity = $scope.l_pro[j].quantity - 1;
                                var _item = {
                                    index: item.item_id,
                                    item_name: item.item_name,
                                    quantity: $scope.l_pro[j].quantity,
                                    price: item.price,
                                    amount: $scope.l_pro[j].quantity * item.price,
                                    original_price: 0.0,
                                    promotion_type: 0.0
                                };
                                foodItems.push(_item);
                                $scope.total_money = $scope.total_money + _item.amount;
                                break;
                            }
                        }
                        break;
                    }
                }
            }

            if (_math === "+") {
                for (var i in foodItems) {
                    if (item.item_id === foodItems[i].index)
                    {
                        $scope.total_money = $scope.total_money - foodItems[i].amount;
                        foodItems.splice(i, 1);
                        for (var j in $scope.l_pro) {
                            if ($scope.l_pro[j].item_id === item.item_id) {
                                $scope.l_pro[j].quantity = $scope.l_pro[j].quantity + 1;
                                var _item = {
                                    index: item.item_id,
                                    item_name: item.item_name,
                                    quantity: $scope.l_pro[j].quantity,
                                    price: item.price,
                                    amount: $scope.l_pro[j].quantity * item.price,
                                    original_price: 0.0,
                                    promotion_type: 0.0
                                };
                                foodItems.push(_item);
                                $scope.total_money = $scope.total_money + _item.amount;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        };

        $scope.bill = function () {
            if (foodItems.length > 0) {
                $rootScope.globals.listItemSelected = foodItems;
                $rootScope.globals.table_number = $scope.table_number;
                $rootScope.globals.table_location = $scope.table_location;
                $location.path("/bill");
            } else {
                PopupService.displayPopup('Bạn vui lòng chọn sản phẩm trước khi thanh toán.');
            }
        };

        function initJsBrige() {
            ZaloPay.ready(() => {
                console.log("ZaloPayBridge is ready");
            });
        }
    }
})();