/* global theApp */
(function () {
    'use strict';
    theApp.factory('ProductService', ProductService);

    ProductService.$inject = ['$rootScope', '$http', '$q', 'API_URL', 'ZALOPAY_URL'];
    function ProductService($rootScope, $http, $q, API_URL, ZALOPAY_URL) {
        var service = {};
        var url = API_URL; 
        var url_zalopay = ZALOPAY_URL; 
        
        service.createOrder = createOrder;
        service.createQRCode = createQRCode;
        service.getListProduct = getListProduct;
        return service;


        function getListProduct() {
            var cmd = "getlist";
            var mc = "mbhtudong3";
            var dtJSON = {merchant_code: mc};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            var req = {
                method: 'GET',
                url: url,
                headers: {
//                  'Content-Type': undefined
//                  'Access-Control-Allow-Origin': 'http://dev.vpos.zing.vn:8585/static/#/'
                },
                data: data
            };
            
            return $http(req).then(handleSuccess, handleError('Error listing item'));
        }
        
        function createOrder(amount, item){
            var param = "?amount=" + amount + "&items=" + item;  
            return $http.get(url + param).then(handleSuccess, handleError('Error when create order'));
        }
        
        function createQRCode(appid, zptranstoken){
            var param = "?appid=" + appid+ "&zptranstoken=" + zptranstoken;  
            return $http.get(url_zalopay + param).then(handleSuccess, handleError('Error when create QRCode'));
        }                      

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
