/* global theApp */
(function () {
    'use strict';
    theApp.factory('ProductService', ProductService);

    ProductService.$inject = ['$http', 'API_URL', 'ZALOPAY_URL', 'MERCHANT_CODE'];
    function ProductService($http, API_URL, ZALOPAY_URL, MERCHANT_CODE) {
        var service = {};
        var url = API_URL; 
        var url_zalopay = ZALOPAY_URL; 
        var mc = MERCHANT_CODE;
        
        service.createOrder = createOrder;
        service.createQRCode = createQRCode;
        service.getListProduct = getListProduct;
        return service;


        function getListProduct() {
            var cmd = "getlist";
            var dtJSON = {merchant_code: mc};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });           
            return $http.post(url, data).then(handleSuccess, handleError('Error listing item'));   
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
