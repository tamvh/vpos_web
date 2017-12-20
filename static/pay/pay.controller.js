(function () {
    'use strict';
    
    theApp
        .controller('PayController', PayController);
    
    PayController.$inject = ['$scope', '$rootScope', 'PayService'];
    function PayController($scope,  $rootScope, PayService) {
        var vm = this;
        $scope.amount = 0;
        $rootScope.invoice_code = "";
        $scope.payInvoice = payInvoice;
        
        get_params();
         
        if ( $rootScope.merchant_code !== undefined &&  $rootScope.invoice_code !== undefined) {
            getPaymentInvoice();
        }
        
        $scope.init = function() {
            initJsBrige();
        };
        
        $scope.init();
        
        function get_params() {
            var cur_url = window.location.href;
            var cur_url_split = cur_url.split('?');
            if (cur_url_split.length === 2) {
                var params = cur_url_split[1];
                var params_split = params.split('&');
                for (var i = 0; i < params_split.length; i++) {
                    var param_i = params_split[i];
                    var param_i_split = param_i.split('=');
                    if (param_i_split.length === 2) {
                        var param_name = param_i_split[0];
                        if (param_name === 'mc') {
                            $rootScope.merchant_code = param_i_split[1];
                        } else if (param_name === 'iv') {
                            $rootScope.invoice_code = param_i_split[1];
                        } 
                    }
                }
            }
        }
        
        function getPaymentInvoice() {
            PayService.getPaymentInvoice(  $rootScope.merchant_code,  $rootScope.invoice_code)
            .then(function (response) {
                if (response.err === 0) {
                    $scope.amount = response.dt.invoice.amount;
                    
                } else {
//                    alert(response.err + ":" + response.msg);
                }
            });
            
        }
        
        function payInvoice() {
            PayService.payInvoice( $rootScope.merchant_code, $rootScope.invoice_code, $scope.amount)
            .then(function (response) {
                if (response.err === 0) {
                    var zptranstoken = response.dt.zptranstoken;
                    var appid = response.dt.appid;
                    ZaloPay.payOrder({
                        appid: appid,
                        zptranstoken: zptranstoken
                    }, $scope.cb);
                } else {
                }
            });
            
        }
        function initJsBrige() {
            ZaloPay.ready(() => {
                console.log("ZaloPayBridge is ready");
            });
        }
        
        $scope.cb = function (data) {

            if (typeof data === "object") {
                if (data.error === 1) {
                    ZaloPay.showDialog({
                        title: "THÔNG BÁO",
                        message: "Thanh toán đơn hàng thành công. Vui lòng nhận hoá đơn.",
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
    }
    
})();
