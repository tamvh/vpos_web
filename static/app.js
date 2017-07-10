/* global posConfig, API_URL, UPLOAD_URL, RESOURCE_URL, ZALOPAY_URL */

var theApp = angular.module('theApp', ['ngRoute', 'ngCookies', 'smart-table', 'ui.bootstrap', 'ngFileUpload', 'angular-confirm', 'ngMaterial', 'bootstrapLightbox', 'angularjs-dropdown-multiselect']);

theApp.constant('API_URL', API_URL); //define CONST API_URL
theApp.constant('ZALOPAY_URL', ZALOPAY_URL); //define CONST API_URL
theApp.constant('UPLOAD_URL', UPLOAD_URL); //define CONST API_URL
theApp.constant('RESOURCE_URL', RESOURCE_URL);

(function () {
    'use strict';
    theApp.config(config)
            .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
    function config($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
                .when('/', {
                    controller: 'ProductController',
                    templateUrl: 'product/product.view.html?v=' + posConfig.TEMPLATE_PRODUCT_VERSION
                })
                .when('/listitem/', {
                    controller: 'ProductController',
                    templateUrl: 'product/product.view.html?v=' + posConfig.TEMPLATE_PRODUCT_VERSION
                })
                .when('/bill/', {
                    controller: 'BillController',
                    templateUrl: 'bill/bill.view.html?v=' + posConfig.TEMPLATE_BILL_VERSION
                })
                .otherwise({redirectTo: '/'});

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    }

    run.$inject = ['$rootScope', '$cookies', '$location', '$window'];
    function run($rootScope, $cookies, $location, $window) {
        $rootScope.globals = {currentUser: {}};
      
        if (localStorage.newtabInfo) {
            var newtabInfo = JSON.parse(localStorage.newtabInfo);
            $cookies.put('u', newtabInfo.u);
            $cookies.put('merchantName', newtabInfo.merchantName);
            $cookies.put('merchantCode', newtabInfo.merchantCode);
            localStorage.removeItem("newtabInfo");
        }

        $rootScope.globals.currentUser.username = "mbh-bsc";


        $rootScope.$on('$locationChangeStart', function (event, next, current) {           
            $rootScope.menuItemList = [
                {
                    index: 0,
                    title: "Sản phẩm",
                    icon: "fa fa-dashboard",
                    value: 1201,
                    bshow: true,
                    link: "#listitem",
                    submenu: []
                }
            ];
        });
    }
    ;


    theApp.directive('currencyInput', function ($filter, $browser) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    $element.val($filter('number')(value, false));
                };

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/,/g, '');
                });

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, false));
                };

                $element.bind('change', listener);
                $element.bind('keydown', function (event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
                        return;
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function () {
                    $browser.defer(listener);
                });
            }
        };
    });
})();
