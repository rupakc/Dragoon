var app = angular.module('dragoonApplication');

app.controller('bookController',["$scope","$http","metaDataRouteService","tableRenderService",
"stringCapitalizeService","validateResultService", "imageRenderService",
function($scope,$http,metaDataRouteService,tableRenderService,stringCapitalizeService,validateResultService,imageRenderService) {
		metaDataRouteService.getGenericDropdownData("book").then(function(response) {
			var responseData = response.data;
			$scope.bookSources = responseData.sources;
			$scope.bookOperations = responseData.operations;
		});

    $scope.submit = function() {
			var search_query = $scope.bookName;
			var bookComicChannels = $scope.selectedBookSourceLabel;
			var bookOperations = $scope.selectedBookOperation;

			$http.get("/bookcomicdata", {params: { q: search_query, bookComicChannels: bookComicChannels, bookOperations: bookOperations }}).then(function(response) {
					 var response = response.data;
					 var accordionHeadingList = stringCapitalizeService.capitalizeFirstLetter(response["channels"]);
					 var accordionContentJsonList = response["resultList"];
					 var accordionDataList = [];
					 for(var i = 0; i < accordionContentJsonList.length; i++) {
						 var validationArray = validateResultService.validateResponse(accordionContentJsonList[i]);
						 if (validationArray[0] == true) {
							 if (bookOperations == "genrepredictionimage") {
								 var tableString = imageRenderService.renderImages(accordionContentJsonList[i]);
							 } else {
								 var jsonHeadersArray = Object.keys(accordionContentJsonList[i][0]);
								 var tableString = tableRenderService.getRenderedTable(jsonHeadersArray,accordionContentJsonList[i]);
						 	 }
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
