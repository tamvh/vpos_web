

/* global theApp */

theApp.controller('HeaderController', function($rootScope,$scope, $http,$cookies, $location, $window) {
    
    var path = $location.path();
    var titlePage = "Sản phẩm";
    switch(path){
        case '/listitem/':
            titlePage = "Sản phẩm";
            break;
    }
    
    $scope.titlePage = titlePage;
    
    $scope.logout = function (){
          
    };
    $scope.reloadPage = function(){
        console.log("page items");
    };	
});