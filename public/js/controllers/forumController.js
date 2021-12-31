var app = angular.module('dragoonApplication');

app.controller('forumController',["$scope","$http","metaDataRouteService","tableRenderService", "validateResultService", "stringCapitalizeService",
function($scope,$http,metaDataRouteService,tableRenderService,validateResultService,stringCapitalizeService) {
		metaDataRouteService.getGenericDropdownData("forum").then(function(response) {
			var responseData = response.data;
			$scope.forumSources = responseData.sources;
			$scope.forumOperations = responseData.operations;
		});

    $scope.submit = function() {
			var search_query = $scope.searchTerm;
			var forumChannels = $scope.selectedForumSourceLabel;
			var operationList = $scope.selectedForumOperationLabel;
			$http.get("/forumdata", {params: { q: search_query, forumChannels: forumChannels, operationList: operationList}}).then(function(response) {
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
