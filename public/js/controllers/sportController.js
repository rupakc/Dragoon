var app = angular.module('dragoonApplication');

app.controller('sportController',["$scope","$http","metaDataRouteService","stringCapitalizeService","validateResultService","tableRenderService",
function($scope,$http,metaDataRouteService,stringCapitalizeService,validateResultService,tableRenderService) {
		metaDataRouteService.getGenericDropdownData("sport").then(function(response) {
			var responseData = response.data;
			$scope.sportSources = responseData.sources;
      $scope.sportOperations = responseData.operations;
		});

    $scope.submit = function() {
      var sportChannels = $scope.selectedSportSourceLabel;
      var sportName = $scope.sportName;
      var searchType = $scope.searchType;
      var auxiliaryInfo = $scope.sportType;
      $http.get("/sportsdata", {params: { sportName: sportName, sportChannels: sportChannels, searchType: searchType, aux: auxiliaryInfo }}).then(function(response) {
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
