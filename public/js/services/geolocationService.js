var app = angular.module('dragoonApplication');

app.factory('geolocationService',['$scope',function($scope,$apply) {
	return {
		getCurrentGeoLocation: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.$apply(function() {
            $scope.position = position;
            console.log(position);
          });
        });
      }
		}
  }
}]);
