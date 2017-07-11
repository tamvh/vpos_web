/* global theApp, sjcl */
(function () {
    'use strict';
    theApp.factory('BillService', BillService);

    BillService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'ZALOPAY_URL', 'MERCHANT_CODE', 'HTTP_TRANSPRO'];
    function BillService($rootScope, $http, $q, API_URL, ZALOPAY_URL, MERCHANT_CODE, HTTP_TRANSPRO) {
        var service = {};
        var url = API_URL;
        var url_zalopay = ZALOPAY_URL;
        var merchant_code = MERCHANT_CODE;
        var http_tranpro = HTTP_TRANSPRO;
        var p_method = 1; // zalopay
        var appTitle = "Chỗ ngồi: " + $rootScope.globals.table_number + " - " + $rootScope.globals.table_location;
        var machine_name = "W-VPOS";
        var key = "7VShsAFE3S4pS3lijpCkIxCDpzi7ljdS";

        service.createQRCode = createQRCode;
        service.getListProduct = getListProduct;
        service.doGetPmsid = doGetPmsid;
        service.doPayZalo = doPayZalo;
        return service;

        function doPayZalo(uuid, sesId, biId, amount, items) {
            var cmd = "create";
            var dtJSON = {
                merchant_code: merchant_code,
                foodsorder_id: biId,
                machine_name: machine_name,
                description: appTitle,
                appuser: merchant_code,
                amount: amount,
                devid: uuid,
                items: items,
                payment_method: p_method
            };
            
            var dt = JSON.stringify(dtJSON);
            var token = HMAC_SHA256_MAC(key, dt + sesId);
            var data = $.param({
                cm: cmd,
                tk: token,
                sid: sesId,
                dt: dt
            });
            return $http.post(http_tranpro, data).then(handleSuccess, handleError('Error doPayZalo'));
        }
        
        function doGetPmsid(deviceId, billId) {
            var cmd = "get_session";
            var dtJSON = {
                merchant_code: merchant_code,
                food_order: billId,
                devid: deviceId
            };
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(http_tranpro, data).then(handleSuccess, handleError('Error get session'));
        }

        function getListProduct() {
            var cmd = "getlist";
            var dtJSON = {merchant_code: merchant_code};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error listing item'));
        }

        function createQRCode(appid, zptranstoken) {
            var param = "?appid=" + appid + "&zptranstoken=" + zptranstoken;
            return $http.get(url_zalopay + param).then(handleSuccess, handleError('Error when create QRCode'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return {err: -2, msg: error};
            };
        }
    }
})();
