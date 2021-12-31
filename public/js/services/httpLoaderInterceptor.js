var app = angular.module('dragoonApplication');

app.service('httpInterceptor', ['$q','$rootScope', function($q, $rootscope){
    var numLoadings = 0;
    var loadingScreen = $('<div id="loaderOverlay"><div id="loaderImage"></div></div>').appendTo($('body')).hide();

    function removeReq(){
        if (!(--numLoadings)) {
            loadingScreen.hide();
            $rootscope.loadingScreenVisible = false;
        }
    }
    function addReq(){
        numLoadings++;
        loadingScreen.show();
        $rootscope.loadingScreenVisible = true;
    }

    return {
        'request' : function(config){
            if(!config || !config.async){
                addReq();
            }
            return config || $q.when(config);
        },

        'response' : function(response){
            if(!response.config || !response.config.async){
                removeReq();
            }
            return response || $q.when(response);
        },
        'responseError': function(rejection) {
            var status = rejection.status;
            if(!rejection.config || !rejection.config.async){
                removeReq();
            }
            return $q.reject(rejection);
        }
    };
}]);
