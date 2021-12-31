var app = angular.module('dragoonApplication');

app.controller('movieController',["$scope","$http","metaDataRouteService",
"tableRenderService","tagFormatService","stringCapitalizeService","validateResultService","imageRenderService",
function($scope,$http,metaDataRouteService,tableRenderService,tagFormatService,stringCapitalizeService,validateResultService,imageRenderService) {
		metaDataRouteService.getGenericDropdownData("movie").then(function(response) {
			var responseData = response.data;
			$scope.movieObjects = responseData.sources;
			$scope.movieOperations = responseData.operations;
		});

		$scope.showAccordion = false;
    $scope.submit = function() {
			var selectedMovieOperation = $scope.movieOperationSelected;
			$scope.showProgressBar = true;
			$http.get("/moviedata", {params: { q: $scope.movieName, movieChannels: $scope.movieSourceLabelSelected, movieOperation: $scope.movieOperationSelected }}).then(function(response) {
				 var response = response.data;
				 var accordionHeadingList = stringCapitalizeService.capitalizeFirstLetter(response["channels"]);
				 var accordionContentJsonList = response["resultList"];
				 var accordionDataList = [];
				 for(var i = 0; i < accordionContentJsonList.length; i++) {
					 var validationArray = validateResultService.validateResponse(accordionContentJsonList[i]);
					 if (validationArray[0] == true) {
							if (selectedMovieOperation == "postergenreprediction") {
								var tableString = imageRenderService.renderImages(accordionContentJsonList[i]);
							} else {
								 if (accordionHeadingList[i] == "Tastedive") {
									 var tableString = tagFormatService.getFormattedTags(accordionContentJsonList[i]);
								 } else {
									 var jsonHeadersArray = Object.keys(accordionContentJsonList[i][0]);
									 var tableString = tableRenderService.getRenderedTable(jsonHeadersArray,accordionContentJsonList[i]);
							 	}
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
