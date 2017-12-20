(function () {
    'use strict';

    theApp
        .factory('PayService', PayService);

    PayService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function PayService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "invoice";
        
        service.getPaymentInvoice = getPaymentInvoice;
        service.payInvoice = payInvoice;
        
        return service;
        
        function getPaymentInvoice(merchantCode, invoiceCode) {
            var cmd = "get_payment_invoice";
            var dtJson = {merchant_code: merchantCode, invoice_code: invoiceCode};
            var dt = JSON.stringify(dtJson);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            // This is real code
            return $http.post(url, data).then(handleSuccess, handleError('getPaymentInvoice error'));
            // This is hard code for local test
            /*
            var deferred = $q.defer();
            var res = { err: 0, msg: 'No eror', dt: {amount: 50000} };
            deferred.resolve(res);
            return deferred.promise;
            */
        }
        
        function payInvoice(merchantCode, invoiceCode, amount) {
            var cmd = "pay_invoice";
            var dtJson = {merchant_code: merchantCode,
                invoice_code: invoiceCode,
                amount: amount,
                apptype: 8,
                devid: 'xxxxxxxxxxxxxxxx'
                };
            var dt = JSON.stringify(dtJson);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            // This is real code
            return $http.post(url, data).then(handleSuccess, handleError('Error payInvoice'));
            // This is hard code for local test
            /*
            var deferred = $q.defer();
            var res = { err: 0, msg: 'Thanh toán thành công', dt: {} };
            deferred.resolve(res);
            return deferred.promise;
            */
        }
        
        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { err: -2, msg: error };
            };
        }
    }
    
})();
