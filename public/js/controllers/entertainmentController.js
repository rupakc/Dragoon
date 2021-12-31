var app = angular.module('dragoonApplication');

app.controller('entertainmentController',["$scope","$http","metaDataRouteService","tableRenderService","stringCapitalizeService","validateResultService",
function($scope,$http,metaDataRouteService,tableRenderService,stringCapitalizeService,validateResultService) {
		metaDataRouteService.getGenericDropdownData("entertainment").then(function(response) {
			var responseData = response.data;
			$scope.entertainmentSources = responseData.sources;
			$scope.entertainmentOperations = responseData.operations;
		});

		$scope.showAccordion = false;
    $scope.submit = function() {
			var jokeChannels = $scope.selectedEntertainmentSourceLabel;
			var search_term = $scope.searchTerm;
			var operationList = $scope.selectedEntertainmentOperation;
			$http.get("/jokedata", {params: { q: search_term, jokeChannels: jokeChannels, operationList: operationList }}).then(function(response) {
				 console.log(response.data);
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
