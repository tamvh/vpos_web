/* global theApp, ZaloPay */

(function () {
    'use strict';

    theApp.controller('BillController', BillController);

    BillController.$inject = ['$scope', 'BillService', '$rootScope', '$uibModal', '$timeout', '$location', 'PopupService'];
    function BillController($scope, BillService, $rootScope, $uibModal, $timeout, $location, PopupService) {
        $scope.l_product = [];
        $scope.total_money = 0;
        $scope.init = function () {
            $scope.l_product = $rootScope.globals.listItemSelected;
            var t_moey = 0;
            for (var i in $scope.l_product) {
                t_moey = t_moey + $scope.l_product[i].amount;
            }
            $scope.total_money = t_moey;
            initJsBrige();
        };
        $scope.init();

        $scope.back = function () {
            $location.path("/");
        };
        function initJsBrige() {
            ZaloPay.ready(() => {
                console.log("ZaloPayBridge is ready");
            });
        }
        $scope.pay = function () {
            ZaloPay.showLoading();
            var uuid = gen_uuid();
            var billId = $.now();
            BillService.doGetPmsid(uuid, billId).then(function (response) {
                if (response.err === 0) {
                    var sid = response.dt.invoice_session;
                    var billid = response.dt.food_order;
                    BillService.doPayZalo(gen_uuid(), sid, billid, $scope.total_money, $scope.l_product).then(function (res) {
                        ZaloPay.hideLoading();
                        alert(JSON.stringify(res));
                        if (res.err === 0) {
                            var zptranstoken = res.dt.zptranstoken;
                            var appid = res.dt.appid;
                            if (sid === res.dt.invoice_session) {
                                ZaloPay.payOrder({
                                    appid: appid,
                                    zptranstoken: zptranstoken
                                }, cb);
                            }
                        }
                    });
                }
            });
        };

        var cb = function (data) {
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