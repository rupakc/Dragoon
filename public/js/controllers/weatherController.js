var app = angular.module('dragoonApplication');

app.controller('weatherController',["$scope","$http","metaDataRouteService","tableRenderService","stringCapitalizeService","validateResultService",
function($scope,$http,metaDataRouteService,tableRenderService,stringCapitalizeService,validateResultService) {
		metaDataRouteService.getGenericDropdownData("weather").then(function(response) {
			var responseData = response.data;
			$scope.weatherSources = responseData.sources;
			$scope.weatherOperations = responseData.operations
		});

    $scope.submit = function() {
			$scope.latitude = 28.548133600000003;
			$scope.longitude = 77.35982039999999;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					$scope.$apply(function() {
						$scope.latitude = position["coords"]["latitude"];
						$scope.longitude = position["coords"]["longitude"];
					});
				});
			}
			var latitude = $scope.latitudeAndOthers;
			var longitude = $scope.longitudeAndOthers;
			var type = $scope.searchType;
			var weatherChannels = $scope.selectedWeatherSource;
			$http.get("/weatherdata", {params: { lat: latitude, lon:longitude, type:type, weatherChannels: weatherChannels }}).then(function(response) {
				 var response = response.data;
				 var accordionHeadingList = stringCapitalizeService.capitalizeFirstLetter(response["channels"]);
				 var accordionContentJsonList = response["resultList"];
				 var accordionDataList = [];
				 for(var i = 0; i < accordionContentJsonList.length; i++) {
					 var validationArray = validateResultService.validateResponse(accordionContentJsonList[i]);
					 if (validationArray[0] == true) {
						 var jsonHeadersArray = Object.keys(accordionContentJsonList[i][0]);
						 var tableString = tableRenderService.getRenderedTable(jsonHeadersArray,accordionContentJsonList[i]);
					 } else {
						 var tableString = validationArray[1];
					 }
					 accordionDataList.push({"heading":accordionHeadingList[i],"content":tableString,"isOpen":false});
			 	}
				 $scope.accordianData = accordionDataList;
				 $scope.showAccordion = true;
				 $scope.status = {open:false};
			});
    }
}]);
