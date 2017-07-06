/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('ProductController', ProductController);

    ProductController.$inject = ['$scope', 'ProductService', '$rootScope', '$uibModal', '$timeout', '$location'];
    function ProductController($scope, ProductService, $rootScope, $uibModal, $timeout, $location) {
        $scope.listProduct = [];
        $scope.order = {};
        $scope.zptranstoken = "";
        $scope.appid = 0;
        var l_pro = [];
        $scope.getListProduct = function () {
            ProductService.getListProduct()
            .then(function (response) {  
                console.log(JSON.stringify(response));
                if (response.err === 0) {
                                      
                } else if (response.err === 101) {      // has not logged in
                    $location.path('/login');
                } else {
                    console.log("error getListProduct");
                }
            });
            init();
            initJsBrige();
        };
        $scope.getListProduct();
        function initJsBrige() {
            ZaloPay.ready(() => {
                console.log("ZaloPayBridge is ready");
            });
        }
        function init() {
            for (var i = 0; i < 2; i++) {
                var item = {};
                item["pro_name"] = "Durex - " + (i + 1);
                item["pro_price"] = 30000;
                item["pro_location"] = i + 1;
                item["pro_img"] = "durex-" + (i + 1) + ".jpg";
                l_pro.push(item);
            }
            $scope.listProduct = l_pro;
        }

        $scope.createOrder = function (amount, item) {
            ZaloPay.showLoading();
            ProductService.createOrder(amount, item).then(function (response) {
                if (response.returncode === 1) {
                    ZaloPay.hideLoading();
                    $scope.order = JSON.parse(response.data.qrinfo);
                    $scope.zptranstoken = $scope.order.zptranstoken;
                    $scope.appid = $scope.order.appid;
                    ZaloPay.payOrder({
                        appid: $scope.appid,
                        zptranstoken: $scope.zptranstoken
                    }, cb);
//                    window.location.href = "https://zalopay.com.vn/openapp/index.html?appid=" + $scope.appid + "&zptranstoken=" + $scope.zptranstoken;                     
                } else {
                    console.log("error when create order");
                    alert("can't call api");
                }
            });
        };
        var cb = function(data) {
            if(typeof data === "object") {
                if(data.error === 1) {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán đơn hàng thành công",
                        button: "OK"
                    });
                } else if(data.error === 4){
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Người dùng huỷ đơn hàng",
                        button: "OK"
                    });
                } else {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán thất bại, errorcode: " + data.errorCode,
                        button: "OK"
                    });
                }
            }
        };
    }
})();