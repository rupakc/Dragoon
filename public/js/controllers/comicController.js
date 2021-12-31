var app = angular.module('dragoonApplication');

app.controller('comicController',["$scope","$http","metaDataRouteService","tableRenderService","stringCapitalizeService","validateResultService",
function($scope,$http,metaDataRouteService,tableRenderService,stringCapitalizeService,validateResultService) {
		metaDataRouteService.getGenericDropdownData("comic").then(function(response) {
			var responseData = response.data;
			$scope.comicSources = responseData.sources;
		});

    $scope.submit = function() {
			var search_query = $scope.comicName;
			var comicChannels = $scope.selectedComicSourceLabel;

			$http.get("/comicdata", {params: { q: search_query, comicChannels: comicChannels}}).then(function(response) {
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
