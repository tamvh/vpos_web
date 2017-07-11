/* global theApp */

(function () {
    'use strict';

    theApp.factory('PopupService', PopupService);

    PopupService.$inject = ['$uibModal'];
    function PopupService($uibModal) {
        var service = {};
        service.displayPopup = displayPopup;
        return service;
        function displayPopup(msg){
            $uibModal.open({
               templateUrl: 'popup/popup.view.html',
               controller: 'PopupCtrl',
               resolve: {
                   msg: function () {
                       return msg;
                   }
               }                
            });
        }       
    }    
})();
