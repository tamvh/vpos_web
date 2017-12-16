/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('BillController', BillController);

    BillController.$inject = ['$scope', 'BillService', '$rootScope', '$cookies', '$uibModal', '$timeout', '$location', 'PopupService'];
    function BillController($scope, BillService, $rootScope, $cookies, $uibModal, $timeout, $location, PopupService) {
        $scope.l_product = [];
        $scope.total_money = 0;
        $scope.total_money_local = 0;
        $scope.errItemCodeOverCharacter = false;
        $scope.item_code = '';
        $scope.style_show_height = "height:200px;";
        $scope.show_writeinfo = false;
        $scope.margin_bottom = "margin-bottom: 200px;";
        $scope.height_space = 220;
        $scope.item_CustomerName = $cookies.get("customername");
        $scope.item_PhoneNo = $cookies.get("phoneno");
        $scope.item_BillNote = $rootScope.g_item_BillNote;
        var sttwriteinfo = false;
        $scope.init = function () {
            $scope.style_show_height = "height:200px;";
            $scope.show_writeinfo = true;
            $scope.margin_bottom = "margin-bottom: 200px;";
            $scope.height_space = 220;
            if ($rootScope.foodItems.length <= 0) {
                $location.path("/");
                return;
            } else {
                var t_money = 0;
                for (var i in $rootScope.foodItems) {
                    $rootScope.foodItems[i].price2k = (parseInt($rootScope.foodItems[i].price) / 1000) + 'K';
                    $rootScope.foodItems[i].amount2k = (parseInt($rootScope.foodItems[i].amount) / 1000) + 'K';
                    t_money = t_money + $rootScope.foodItems[i].amount;
                }
                $scope.total_money = t_money;
                initJsBrige();
            }
        };
        $scope.init();

        $scope.back = function () {
//            window.history.back();
            $location.path("/");
        };
        function initJsBrige() {
            ZaloPay.ready(() => {
                console.log("ZaloPayBridge is ready");
            });
        }

        $scope.openpopup = function (item) {
            console.log('init item: ' + JSON.stringify(item));
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupAddNote.html',
                controller: 'AddNoteController',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
        };

        $scope.delete_all_item = function () {
            $rootScope.foodItems = [];
            $location.path("/");
        };

        $scope.delete_item = function (item) {
            for (var i in $rootScope.foodItems) {
                if ($rootScope.foodItems[i].index === item.index) {
                    $rootScope.foodItems.splice(i, 1);
                }
            }
            $scope.get_total_money();
        };
        $scope.get_total_money = function () {
            var t_money = 0;
            for (var i in $rootScope.foodItems) {
                t_money = t_money + $rootScope.foodItems[i].amount;
            }
            $scope.total_money = t_money;
            if (t_money <= 0) {
                $location.path("/");
            }
        };

        $scope.writeInfo = function () {
            if (sttwriteinfo === true) {
                sttwriteinfo = false;
            } else {
                sttwriteinfo = true;
            }
            if (sttwriteinfo) {
                $scope.style_show_height = "height:90px;";
                $scope.show_writeinfo = false;
                $scope.margin_bottom = "margin-bottom: 90px;";
                $scope.height_space = 110;
            } else {
                $scope.style_show_height = "height:200px;";
                $scope.show_writeinfo = true;
                $scope.margin_bottom = "margin-bottom: 200px;";
                $scope.height_space = 220;
            }
        };

        $scope.typingItemNote = function () {
            console.log("tying: " + $scope.item_code + '');
            var typing = $scope.item_code + '';
            if (typing.length > 20) {
                typing = typing.substring(0, 19);
                $scope.item_code = typing;
                $scope.errItemCodeOverCharacter = true;
            } else {
                $scope.item_code = typing;
                $scope.errItemCodeOverCharacter = false;
            }
        };
        
        $scope.typingItemCustomerName = function() {
            var typing = $scope.item_CustomerName;
            $cookies.put("customername", typing);
        };
        
        $scope.typingItemPhoneNo = function() {
            var typing = $scope.item_PhoneNo;
            $cookies.put("phoneno", typing);
        };
        
        $scope.typingBillNote = function() {
            var typing = $scope.item_BillNote;
            $rootScope.g_item_BillNote = typing;
        };

        $scope.ok = function () {

        };

        $scope.cancel = function () {

        };

        $scope.pay = function () {
            ZaloPay.showLoading();
            var uuid = gen_uuid();
            var billId = $.now();
            var item_CustomerName = $scope.item_CustomerName;
            var item_PhoneNo = $scope.item_PhoneNo;
            var item_BillNote = $scope.item_BillNote;
            console.log("item_CustomerName: " + item_CustomerName);
            console.log("item_PhoneNo: " + item_PhoneNo);
            console.log("item_BillNote: " + item_BillNote);
            $scope.l_product = $rootScope.foodItems;
            $scope.total_money_local = $scope.total_money;
            BillService.doGetPmsid(uuid, billId).then(function (response) {
                if (response.err === 0) {
                    var sid = response.dt.invoice_session;
                    var billid = response.dt.food_order;
                    BillService.doPayZalo(gen_uuid(), sid, billid, $scope.total_money_local, $scope.l_product, item_CustomerName, item_PhoneNo, item_BillNote).then(function (res) {
                        ZaloPay.hideLoading();
                        if (res.err === 0) {
                            var zptranstoken = res.dt.zptranstoken;
                            var appid = res.dt.appid;
//                            if (sid === res.dt.invoice_session) {
                            ZaloPay.payOrder({
                                appid: appid,
                                zptranstoken: zptranstoken
                            }, $scope.cb);
//                            }
                        } else {
                            PopupService.displayPopup('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
                        }
                    });
                } else {
                    PopupService.displayPopup('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
                }
            });

            $rootScope.foodItems = [];
            $rootScope.g_item_BillNote = "";
            $scope.total_money = 0;
            $location.path("/");
        };

        $scope.cb = function (data) {

            if (typeof data === "object") {
                if (data.error === 1) {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán đơn hàng thành công",
                        button: "OK"
                    });

                } else if (data.error === 4) {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Người dùng huỷ đơn hàng.",
                        button: "OK"
                    });
                } else {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán thất bại. Vui lòng thử lại.",
                        button: "OK"
                    });
                }
            }
        };

        function gen_uuid() {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("");
        }
    }
})();