var app = angular.module('dragoonApplication');

app.controller('headerController', ["$scope","$http","metaDataRouteService",function($scope,$http,metaDataRouteService) {
      $scope.isOpen = true;
      $scope.demo = {
        isOpen: true,
        count: 0,
        selectedDirection: 'right'
      };
			metaDataRouteService.getHeaderOptions().then(function(response) {
					var responseData = response.data;
					$scope.headerObjects = responseData;
			});
}]);

app.controller('tabController',["$scope","$http","metaDataRouteService",function($scope,$http,metaDataRouteService) {
		$scope.tab = {"isOpen": true};
		$scope.toggleView = function() {
			$scope.tab = !$scope.tab.isOpen;
		};
		metaDataRouteService.getTabOptions().then(function(response) {
			var responseData = response.data;
			$scope.tabObjects = responseData;
		});
}]);
