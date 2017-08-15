/* global theApp, sjcl */
(function () {
    'use strict';
    theApp.factory('LoginService', LoginService);

    LoginService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function LoginService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL;
        
        service.vertify = vertify;
        return service;

        function vertify() {
            var cmd = "vertify";
            var dtJSON = {
                session_id: ""
            };
            
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url + cmd, data).then(handleSuccess, handleError('Error'));
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
