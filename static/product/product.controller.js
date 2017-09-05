/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', 'ProductService', '$rootScope', '$cookies', '$location', 'PopupService'];
    function ProductController($scope, ProductService, $rootScope, $cookies, $location, PopupService) {
        $scope.listProduct = [];
        $scope.order = {};
        $scope.zptranstoken = "";
        $scope.appid = 0;
        $scope.l_pro = [];
        $scope.l_categories = [];
        $scope.total_money = 0;
        $scope.table_number = "#";
        $scope.table_location = "#";
        var foodItems = [];
        var dt_items = [];
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

        $scope.getProdInCategory = function (cate_name) {
            $scope.l_pro.splice(0, $scope.l_pro.length);
            for (var j in $scope.l_categories) {
                if (cate_name === $scope.l_categories[j].category_name) {
                    $scope.l_categories[j].category_color = "#E0E0E0";
                } else {
                    $scope.l_categories[j].category_color = "#FAFAFA";
                }
            }
            if (cate_name === "Tất cả") {
                for (var i in dt_items) {
                    if (dt_items[i].status === 1) {
                        $scope.l_pro.push(dt_items[i]);
                    }
                }
                document.getElementById("mySidenav").style.width = "0";
                return;
            }
            for (var i in dt_items) {
                if (cate_name === dt_items[i].category_name) {
                    if (dt_items[i].status === 1) {
                        $scope.l_pro.push(dt_items[i]);
                    }
                }
            }
            document.getElementById("mySidenav").style.width = "0";
        };

        $scope.getListProduct = function () {
            initJsBrige();
            get_params();
            ProductService.getListProduct()
                    .then(function (response) {
                        if (response.err === 0) {

                            img_host = response.dt.img_host;

                            for (var i in response.dt.categories) {
                                if (response.dt.categories[i].status === 0 &&
                                        response.dt.categories[i].category_name === 'Tất cả') {
                                    response.dt.categories[i].category_color = "#E0E0E0";
                                    $scope.l_categories.push(response.dt.categories[i]);
                                }
                                if (response.dt.categories[i].status === 1) {
                                    response.dt.categories[i].category_color = "#FAFAFA";
                                    $scope.l_categories.push(response.dt.categories[i]);
                                }

                            }
                            dt_items = response.dt.items;
                            
                            var _total_money = $cookies.get("totalmoney");
                            if(_total_money + '' === '' || _total_money + '' === 'undefined') {
                                $scope.total_money = 0;
                            } else {
                                $scope.total_money = parseInt(_total_money);
                            }
                            
                            var foods = $cookies.get("fooditems");
                            var arr_food = [];
                            if (foods + '' !== '' && foods + '' !== 'undefined') {
                                arr_food = JSON.parse(foods);
                                foodItems = arr_food;
                            }
                            if (arr_food.length > 0) {
                                for (var i in dt_items) {
                                    if (dt_items[i].status === 1) {
                                        if (dt_items[i].item_name.length > 25) {
                                            dt_items[i].name_view = dt_items[i].item_name.toString().substr(0, 24) + "...";
                                        } else {
                                            dt_items[i].name_view = dt_items[i].item_name;
                                        }

                                        dt_items[i].img_path = img_host + dt_items[i].img_path;
                                        dt_items[i].img_checked = "img/checked.png";

                                        dt_items[i].img = dt_items[i].img_path;
                                        dt_items[i].quantity = "";
                                        dt_items[i].icon_minus = "";
                                        dt_items[i].icon_plus = "";
                                        dt_items[i].bgcolor = "white";
                                        dt_items[i].width_item = "col-md-10 col-sm-10 col-xs-10";
                                        dt_items[i].width_btn = "col-md-0 col-sm-0 col-xs-0";
                                        for (var j in arr_food) {
                                            if (arr_food[j].index === dt_items[i].item_id) {
                                                dt_items[i].img = "img/checked.png";
                                                dt_items[i].quantity = arr_food[j].quantity;
                                                dt_items[i].icon_minus = "-";
                                                dt_items[i].icon_plus = "+";
                                                dt_items[i].bgcolor = "#E0E0E0";
                                                dt_items[i].width_item = "col-md-7 col-sm-7 col-xs-7";
                                                dt_items[i].width_btn = "col-md-3 col-sm-3 col-xs-3";
                                                break;
                                            }
                                        }
                                        $scope.l_pro.push(dt_items[i]);
                                    }

                                }
                            } else {
                                for (var i in dt_items) {
                                    if (dt_items[i].status === 1) {
                                        dt_items[i].bgcolor = "white";
                                        if (dt_items[i].item_name.length > 25) {
                                            dt_items[i].name_view = dt_items[i].item_name.toString().substr(0, 24) + "...";
                                        } else {
                                            dt_items[i].name_view = dt_items[i].item_name;
                                        }

                                        dt_items[i].quantity = "";
                                        dt_items[i].icon_minus = "";
                                        dt_items[i].icon_plus = "";
                                        dt_items[i].img_path = img_host + dt_items[i].img_path;
                                        dt_items[i].img_checked = "img/checked.png";
                                        dt_items[i].img = dt_items[i].img_path;
                                        dt_items[i].width_item = "col-md-10 col-sm-10 col-xs-10";
                                        dt_items[i].width_btn = "col-md-0 col-sm-0 col-xs-0";
                                        $scope.l_pro.push(dt_items[i]);
                                    }
                                }
                            }
                        } else if (response.err === 101) {      // has not logged in
                            $location.path('/login');
                        } else {
                            console.log("error getListProduct");
                        }
                    });
        };
        $scope.getListProduct();
        function setItem(item) {
            for (var i in dt_items) {
                if (dt_items[i].item_id === item.item_id) {
                    console.log(JSON.stringify(item));
                    dt_items[i] = item;
                    break;
                }
            }
        }
        $scope.selectItem = function (item) {
            console.log("===select item===");
            for (var i in $scope.l_pro) {
                if ($scope.l_pro[i].item_id === item.item_id) {
                    $scope.l_pro[i].width_item = "col-md-7 col-sm-7 col-xs-7";
                    $scope.l_pro[i].width_btn = "col-md-3 col-sm-3 col-xs-3";
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
                    setItem($scope.l_pro[i]);
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
                            $cookies.put("totalmoney", $scope.total_money);
                            _find = false;
                            break;
                        }
                    }
                    if (_find) {
                        foodItems.push(_item);
                        $scope.total_money = $scope.total_money + _item.amount;
                        $cookies.put("totalmoney", $scope.total_money);
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
                            $scope.l_pro[j].width_item = "col-md-10 col-sm-10 col-xs-10";
                            $scope.l_pro[j].width_btn = "col-md-0 col-sm-0 col-xs-0";

                            break;
                        }
                    }
                    $scope.total_money = $scope.total_money - foodItems[i].amount.toString();
                    $cookies.put("totalmoney", $scope.total_money);
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
                                    $scope.l_pro[j].width_item = "col-md-10 col-sm-10 col-xs-10";
                                    $scope.l_pro[j].width_btn = "col-md-0 col-sm-0 col-xs-0";
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
                                $cookies.put("totalmoney", $scope.total_money);
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
                                $cookies.put("totalmoney", $scope.total_money);
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
                $cookies.put("fooditems", JSON.stringify(foodItems));
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