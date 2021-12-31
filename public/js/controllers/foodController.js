var app = angular.module('dragoonApplication');

app.controller('foodController', ['$scope','$http','metaDataRouteService','tableRenderService','stringCapitalizeService','validateResultService',
function($scope,$http,metaDataRouteService,tableRenderService,stringCapitalizeService,validateResultService) {
		 metaDataRouteService.getFoodSourcesDropdown().then(function(response) {
			 var responseOptions = response.data;
				$scope.foodSources = responseOptions.sources;
				$scope.foodOperations = responseOptions.operations;
		 });

		 $scope.showAccordion = false;
		 $scope.submit = function() {
			 var beer_query = $scope.beerName;
			 var food_query = $scope.foodName;
			 var drinkChannels = $scope.selectedFoodSourceLabel;
			 var foodOperationList = $scope.selectedFoodOperation;
			 $http.get("/drinkdata", {params: { beer: beer_query, drinkChannels: drinkChannels, food: food_query, foodOperationList: foodOperationList }}).then(function(response) {
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
	};
}]);
