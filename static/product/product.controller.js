/* global theApp, ZaloPay, global_click_menu, $uibModal */

(function () {
    'use strict';

    theApp.controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', 'ProductService', '$rootScope', '$cookies', '$location', 'PopupService', '$uibModal'];
    function ProductController($scope, ProductService, $rootScope, $cookies, $location, PopupService, $uibModal) {
        $scope.order = {};
        $scope.zptranstoken = "";
        $scope.appid = 0;
        $scope.tablenumber = "#";
        $scope.tablelocation = "#";
        $scope.dwidth = 0;
        $scope.current_category = "Tất cả";
        $scope.total_item_in_category = 0;
        var dt_items = [];
        var img_host = "";
        var global_click_menu = false;
        function get_params() {
            var cur_url = window.location.href;
            if (cur_url.split('?').length === 2) {
                var params = cur_url.split('?')[1];
                if (params.split('=').length === 2) {
                    var dt = params.split('=')[1];
                    var json_obj = JSON.parse(decodeURI(dt));
                    $rootScope.customer_location = json_obj.customer_location;
                }
            }
        }

        $scope.getProdInCategory = function (cate) {
            var count_item_in_cate = 0;
            $rootScope.l_pro.splice(0, $rootScope.l_pro.length);
            var cate_name = cate.category_name;
            var cate_value = cate.category_value;
            var cate_id = cate.category_id;
            console.log('cate list: ' + JSON.stringify($rootScope.l_categories));
            for (var j in $rootScope.l_categories) {
                console.log('cate_id: ' + $rootScope.l_categories[j].category_id);
                if (cate_id === $rootScope.l_categories[j].category_id) {
                    $rootScope.l_categories[j].category_color = "#00A2E6";
                    $scope.current_category = $rootScope.l_categories[j].category_name;
                } else {
                    $rootScope.l_categories[j].category_color = "#000000";
                }
            }
            if (cate_name === "Tất cả") {
                
                for (var i in dt_items) {
                    if (dt_items[i].status === 1) {
                        count_item_in_cate = count_item_in_cate + 1;
                        $rootScope.l_pro.push(dt_items[i]);
                    }
                }
                $scope.total_item_in_category = count_item_in_cate;
                document.getElementById("mySidenav").style.width = "0";
                return;
            }
            
            for (var i in dt_items) {
                if (cate_value === dt_items[i].cate_mask) {
                    if (dt_items[i].status === 1) {
                        count_item_in_cate = count_item_in_cate + 1;
                        $rootScope.l_pro.push(dt_items[i]);
                    }
                }
            }
            document.getElementById("mySidenav").style.width = "0";
            $scope.total_item_in_category = count_item_in_cate;
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
                $rootScope.foodItems = arr_food;
            }
           
            for (var j in $rootScope.foodItems) {
                _soluong = $rootScope.foodItems[j].quantity;
                _price = $rootScope.foodItems[j].price;
                _amount = _price * _soluong;
                _total_amout = _total_amout + _amount;
            }
            $rootScope.totalmoney = _total_amout;
            $cookies.put("totalmoney", $rootScope.totalmoney);
        };

        $scope.getListProduct = function () {
            initJsBrige();
            get_params();
            $scope.dwidth = $(window).width();
            $rootScope.l_categories = [];
            ProductService.getListProduct()
                    .then(function (response) {
                        if (response.err === 0) {
                            img_host = response.dt.img_host;
                            for (var i in response.dt.categories) {
                                if (response.dt.categories[i].status === 0 &&
                                        response.dt.categories[i].category_name === 'Tất cả') {
                                    response.dt.categories[i].category_color = "#00A2E6";
                                    response.dt.categories[i].icon = "img/item_all.svg";
                                    $rootScope.l_categories.push(response.dt.categories[i]);
                                }
                                if (response.dt.categories[i].status === 1) {
                                    response.dt.categories[i].category_color = "#000000";
                                    response.dt.categories[i].icon = "img/menu_item.svg";
                                    $rootScope.l_categories.push(response.dt.categories[i]);
                                }

                            }
                            dt_items = response.dt.items;
                            
                            var foods = $cookies.get("fooditems");
                            var arr_food = [];
                            if (foods + '' !== '' && foods + '' !== 'undefined') {
                                arr_food = JSON.parse(foods);
                                $rootScope.foodItems = arr_food;
                            }
                            if (arr_food.length > 0) {
                                for (var i in dt_items) {
                                    if (dt_items[i].status === 1) {
                                        dt_items[i].name_view = dt_items[i].item_name;    
                                        if(checkExistImgUrl(dt_items[i].img_path)) {
                                            dt_items[i].img_path = img_host + dt_items[i].img_path;
                                        } else {
                                            dt_items[i].img_path = "img/noimg.png";
                                        }
                                        
                                        dt_items[i].img_checked = "img/checked.png";

                                        dt_items[i].img = dt_items[i].img_path;
                                        
                                        dt_items[i].quantity = 0;
                                        dt_items[i].show_quantity = false;
                                        dt_items[i].bgcolor = "white";
                                        for (var j in arr_food) {
                                            if (arr_food[j].index === dt_items[i].item_id) {
                                                dt_items[i].img = "img/checked.png";
                                                dt_items[i].quantity = arr_food[j].quantity;
                                                if(dt_items[i].quantity > 0) {
                                                    dt_items[i].show_quantity = true;
                                                } else {
                                                    dt_items[i].show_quantity = false;
                                                }
                                                dt_items[i].showaction = true;
                                                dt_items[i].bgcolor = "#E0E0E0";
                                                break;
                                            }
                                        }
                                        $rootScope.l_pro.push(dt_items[i]);
                                    }

                                }
                            } else {
                                for (var i in dt_items) {
                                    if (dt_items[i].status === 1) {
                                        dt_items[i].bgcolor = "white";
                                        dt_items[i].name_view = dt_items[i].item_name;
                                        dt_items[i].quantity = 0;
                                        if(checkExistImgUrl(dt_items[i].img_path)) {
                                            dt_items[i].img_path = img_host + dt_items[i].img_path;
                                        } else {
                                            dt_items[i].img_path = "img/noimg.png";
                                        }
                                        dt_items[i].showaction = false;
                                        dt_items[i].img_checked = "img/checked.png";
                                        dt_items[i].img = dt_items[i].img_path;
                                        if(dt_items[i].quantity > 0) {
                                            dt_items[i].show_quantity = true;
                                        } else {
                                            dt_items[i].show_quantity = false;
                                        }
                                        $rootScope.l_pro.push(dt_items[i]);
                                    }
                                }
                            }
                            
                        } else {
                            console.log("error getListProduct");
                        }
                        $scope.total_item_in_category = dt_items.length;
                        console.log(JSON.stringify(dt_items));
                    });
            $scope.gettotal_money();
        };
        
        function checkExistImgUrl(img_url) {
            var local_img_url = img_url;
            if(local_img_url.search(".jpg")>=0 || local_img_url.search(".png")>=0 || local_img_url.search(".jepg")>=0) {
                return true;
            }
            return false;
        }
        
        $scope.getListProduct();
        
        $scope.openNav = function() {
            
            global_click_menu = true;
            document.getElementById("mySidenav").style.width = "200px";
        };

        $scope.closeNav = function() {
            global_click_menu = false;
            document.getElementById("mySidenav").style.width = "0";
        };

        $scope.deleteItem = function (item) {
            global_click_menu = false;
            if(item.quantity > 0){
                for(var i in $rootScope.l_pro) {
                    if($rootScope.l_pro[i].item_id === item.item_id) {
                        $rootScope.l_pro[i].img = item.img_path;
                        $rootScope.l_pro[i].show_quantity = false;
                        $rootScope.l_pro[i].quantity = 0;
                        for(var k in $rootScope.foodItems) {
                            if (item.item_id === $rootScope.foodItems[k].index) {
                                $rootScope.foodItems.splice(k, 1);
                                break;
                            }
                        }
                        $cookies.put("fooditems", JSON.stringify($rootScope.foodItems));
                        $scope.gettotal_money();
                        break;
                    }
                }
            } else {
                $scope.openpopupadditem(item);
            }

        };
                
        $scope.openpopupadditem = function(item) {
            global_click_menu = false;
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupAddItem.html',
                controller: 'AddItemController',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            });
        };

        $scope.bill = function () {
            global_click_menu = false;
            if ($rootScope.foodItems.length > 0) {
                $cookies.put("fooditems", JSON.stringify($rootScope.foodItems));
                $rootScope.globals.listItemSelected = $rootScope.foodItems;
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

