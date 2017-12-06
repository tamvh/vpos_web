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
        $scope.totalmoney = 0;
        $scope.tablenumber = "#";
        $scope.tablelocation = "#";
        var foodItems = [];
        var dt_items = [];
        var img_host = "";
        var find_btn_area = false;
        function get_params() {
            var cur_url = window.location.href;
            if (cur_url.split('?').length === 2) {
                var params = cur_url.split('?')[1];
                if (params.split('=').length === 2) {
                    var dt = params.split('=')[1];
                    var json_obj = JSON.parse(decodeURI(dt));
                    $scope.tablenumber = json_obj.tablenumber;
                    $scope.tablelocation = json_obj.tablelocation;
                }
            }
        }

        $scope.getProdInCategory = function (cate) {
            $scope.l_pro.splice(0, $scope.l_pro.length);
            var cate_name = cate.category_name;
            var cate_value = cate.category_value;
            var cate_id = cate.category_id;
            console.log('cate list: ' + JSON.stringify($scope.l_categories));
            for (var j in $scope.l_categories) {
                console.log('cate_id: ' + $scope.l_categories[j].category_id);
                if (cate_id === $scope.l_categories[j].category_id) {
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
                if (cate_value === dt_items[i].cate_mask) {
                    if (dt_items[i].status === 1) {
                        $scope.l_pro.push(dt_items[i]);
                    }
                }
            }
            document.getElementById("mySidenav").style.width = "0";
        };

        $scope.gettotal_money = function() {
            var _soluong = 0;
            var _amount = 0;
            var _price = 0;
            var _total_amout = 0;
            
            var foods = $cookies.get("fooditems");
            console.log('food: ' + foods);
            var arr_food = [];
            if (foods + '' !== '' && foods + '' !== 'undefined') {
                arr_food = JSON.parse(foods);
                foodItems = arr_food;
            }
           
            for (var j in foodItems) {
                _soluong = foodItems[j].quantity;
                _price = foodItems[j].price;
                _amount = _price * _soluong;
                _total_amout = _total_amout + _amount;
            }
            $scope.totalmoney = _total_amout;
            $cookies.put("totalmoney", $scope.totalmoney);
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
                            
                            var foods = $cookies.get("fooditems");
                            var arr_food = [];
                            if (foods + '' !== '' && foods + '' !== 'undefined') {
                                arr_food = JSON.parse(foods);
                                foodItems = arr_food;
                                find_btn_area = true;  
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
                                        for (var j in arr_food) {
                                            if (arr_food[j].index === dt_items[i].item_id) {
                                                dt_items[i].img = "img/checked.png";
                                                dt_items[i].quantity = arr_food[j].quantity;
                                                dt_items[i].icon_minus = "-";
                                                dt_items[i].icon_plus = "+";
                                                dt_items[i].bgcolor = "#E0E0E0";
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
                                        $scope.l_pro.push(dt_items[i]);
                                    }
                                }
                            }
                        } else {
                            console.log("error getListProduct");
                        }
                    });
            $scope.gettotal_money();
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
            find_btn_area = true;
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
                    setItem($scope.l_pro[i]);
                    var _item = {
                        index: item.item_id,
                        item_name: item.item_name,
                        quantity: item_quantity,
                        price: item.price,
                        amount: item_amount,
                        original_price: 0.0,
                        promotion_type: 0.0,
                        note:''
                    };

                    for (var j in foodItems) {
                        if (foodItems[j].index === item.item_id) {
                            foodItems[j].quantity = foodItems[j].quantity + 1;
                            foodItems[j].amount = foodItems[j].quantity * foodItems[j].price;
                            $cookies.put("fooditems", JSON.stringify(foodItems));
                            $scope.gettotal_money();
                            _find = false;
                            break;
                        }
                    }
                    if (_find) {
                        foodItems.push(_item);
                        $cookies.put("fooditems", JSON.stringify(foodItems));
                        $scope.gettotal_money();
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
                    foodItems.splice(i, 1);
                    $cookies.put("fooditems", JSON.stringify(foodItems));
                    $scope.gettotal_money();
                    _find = true;
                    break;
                }
            }
            if (!_find) {
                $scope.selectItem(item);
            }
            find_btn_area = false;
        };

        $scope.change = function(item) {
            console.log('select area');
            if(find_btn_area) {
                return;
            }
            find_btn_area = false;
            for (var i in foodItems) {
                if (item.item_id === foodItems[i].index)
                {
                    find_btn_area = true;
                    break;
                }
            }
            if(!find_btn_area) {
                console.log('add new item');
                $scope.selectItem(item);
            }
            find_btn_area = true;    
        };
        
        $scope.change_quantity = function (_math, item) {
            console.log('change quantity');
            var _find_minus = false;
            var _find_plus = false;
            var _find_num = false;
            if(!find_btn_area) {
                return;
            }
            if(_math === "num") {
                for (var i in foodItems) {
                    if (item.item_id === foodItems[i].index)
                    {
                        _find_num = true;
                        break;
                    }
                }
                if(!_find_num) {
                    console.log('add new item');
                    $scope.selectItem(item);
                }
            }
            
            if (_math === "-") {
                for (var i in foodItems) {
                    if (item.item_id === foodItems[i].index)
                    {
                        foodItems.splice(i, 1);
                        $cookies.put("fooditems", JSON.stringify(foodItems));
                        for (var j in $scope.l_pro) {
                            if ($scope.l_pro[j].item_id === item.item_id) {
                                if ($scope.l_pro[j].quantity === 1) {
                                    $scope.l_pro[j].quantity = "";
                                    $scope.l_pro[j].bgcolor = "white";
                                    $scope.l_pro[j].img = $scope.l_pro[j].img_path;
                                    $scope.l_pro[j].icon_minus = "";
                                    $scope.l_pro[j].icon_plus = "";
                                    $scope.gettotal_money();
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
                                    promotion_type: 0.0,
                                    note:''
                                };
                                foodItems.push(_item);
                                $cookies.put("fooditems", JSON.stringify(foodItems));
                                $scope.gettotal_money();
                                break;
                            }
                        }
                        _find_minus = true;
                        break;
                    }
                }
                if(!_find_minus) {
                    console.log('add new item');
                    $scope.selectItem(item);
                }
            }

            if (_math === "+") {
                for (var i in foodItems) {
                    if (item.item_id === foodItems[i].index)
                    {
                        foodItems.splice(i, 1);
                        $cookies.put("fooditems", JSON.stringify(foodItems));
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
                                    promotion_type: 0.0,
                                    note:''
                                };
                                foodItems.push(_item);
                                $cookies.put("fooditems", JSON.stringify(foodItems));
                                $scope.gettotal_money();
                                break;
                            }
                        }
                        _find_plus = true;
                        break;
                    }
                }
                if(!_find_plus) {
                    console.log('add new item plus');
                    $scope.selectItem(item);
                }
            }
        };
                
        

        $scope.bill = function () {
            
            if (foodItems.length > 0) {
                $cookies.put("fooditems", JSON.stringify(foodItems));
                $rootScope.globals.listItemSelected = foodItems;
                $rootScope.globals.tablenumber = $scope.tablenumber;
                $rootScope.globals.tablelocation = $scope.tablelocation;
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