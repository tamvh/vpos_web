/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('BillController', BillController);

    BillController.$inject = ['$scope', 'BillService', '$rootScope', '$cookies', '$uibModal', '$timeout', '$location', 'PopupService'];
    function BillController($scope, BillService, $rootScope, $cookies, $uibModal, $timeout, $location, PopupService) {
        $scope.l_product = [];
        $scope.total_money = 0;
        $scope.errItemCodeOverCharacter = false;
        $scope.item_code = '';
        $scope.style_show_height = "height:90px;";
        $scope.show_writeinfo = false;
        $scope.margin_bottom = "margin-bottom: 90px;";
        $scope.height_space = 110;
        $scope.item_CustomerName = "";
        $scope.item_PhoneNo = "";
        $scope.item_BillNote = "";
        var sttwriteinfo = false;
        $scope.init = function () {
            $scope.style_show_height = "height:90px;";
            $scope.show_writeinfo = false;
            $scope.margin_bottom = "margin-bottom: 90px;";
            $scope.height_space = 110;
            if($rootScope.foodItems.length <= 0) {
                $location.path("/");
            } else {
                $scope.l_product = $rootScope.foodItems;
                if($scope.l_product.length <= 0) {
                    $location.path("/");
                    return;
                }
                var t_money = 0;
                for (var i in $scope.l_product) {
                    $scope.l_product[i].price2k = (parseInt($scope.l_product[i].price) / 1000) + 'K';
                    $scope.l_product[i].amount2k = (parseInt($scope.l_product[i].amount) / 1000) + 'K';
                    t_money = t_money + $scope.l_product[i].amount;
                }
                $rootScope.foodItems = $scope.l_product;
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
        
        $scope.openpopup = function(item) {
            console.log('init item: ' + JSON.stringify(item));
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupAddNote.html',
                controller: 'AddNoteController',
                resolve: {
                    item: function(){
                        return item;
                    }
                }
            });
        };
        
        $scope.writeInfo = function() {
            if(sttwriteinfo === true) {
                sttwriteinfo = false;
            } else {
                sttwriteinfo = true;
            }
            if(sttwriteinfo) {
                $scope.style_show_height = "height:200px;";
                $scope.show_writeinfo = true;
                $scope.margin_bottom = "margin-bottom: 200px;";
                $scope.height_space = 220;
            } else {
                $scope.style_show_height = "height:90px;";
                $scope.show_writeinfo = false;
                $scope.margin_bottom = "margin-bottom: 90px;";
                $scope.height_space = 110;
            }
        };
        
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
            
        };
        
        $scope.cancel = function() {
            
        };
        
        $scope.pay = function () {
            ZaloPay.showLoading();
            var uuid = gen_uuid();
            var billId = $.now();
            var item_CustomerName = $scope.item_CustomerName ;
            var item_PhoneNo = $scope.item_PhoneNo;
            var item_BillNote = $scope.item_BillNote;
            console.log("item_CustomerName: " + item_CustomerName);
            console.log("item_PhoneNo: " + item_PhoneNo);
            console.log("item_BillNote: " + item_BillNote);
            BillService.doGetPmsid(uuid, billId).then(function (response) {
                if (response.err === 0) {
                    var sid = response.dt.invoice_session;
                    var billid = response.dt.food_order;
                    BillService.doPayZalo(gen_uuid(), sid, billid, $scope.total_money, $scope.l_product, item_CustomerName, item_PhoneNo, item_BillNote).then(function (res) {
                        ZaloPay.hideLoading();
                        if (res.err === 0) {
                            var zptranstoken = res.dt.zptranstoken;
                            var appid = res.dt.appid;
//                            if (sid === res.dt.invoice_session) {
                                ZaloPay.payOrder({
                                    appid: appid,
                                    zptranstoken: zptranstoken
                                }, cb);
//                            }
                        } else {
                            PopupService.displayPopup('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại. #Err: ' + JSON.stringify(res));
                        }
                    });
                } else {
                    PopupService.displayPopup('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại. #Err: ' + JSON.stringify(response));
                }
            });
            $rootScope.foodItems = [];
            $cookies.put("totalmoney", '');
        };

        var cb = function (data) {
            $location.path("/");
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
                        message: "Người dùng huỷ đơn hàng",
                        button: "OK"
                    });
                } else {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán thất bại",
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