var app = angular.module('dragoonApplication');

app.factory('metaDataRouteService',['$http',function($http) {
	return {
		getFoodSourcesDropdown: function() {
			return $http.get("/foodsources");
		},
    getTabOptions: function() {
      return $http.get("/tabOptions");
    },

    getHeaderOptions: function() {
      return $http.get("/headerOptions");
    },

		getGenericDropdownData: function(dataType) {
			if (dataType == "food") {
				return $http.get("/foodsources");
			} else if (dataType == "movie") {
				return $http.get("/moviesources");
			} else if (dataType == "weather") {
				return $http.get("/weathersources");
			} else if (dataType == "book") {
				return $http.get("/booksources");
			} else if (dataType == "entertainment") {
				return $http.get("/entertainmentsources");
			} else if (dataType == "game") {
				return $http.get("/gamesources");
			} else if (dataType == "forum") {
				return $http.get("/forumsources");
			} else if (dataType == "sport") {
				return $http.get("/sportsources");
			} else if (dataType == "comic") {
				return $http.get("/comicsources");
			}
		}
	}

}]);

app.factory('stringPadService',function() {
	return {
		getPaddedString: function(stringValue,padSpacesDefault=125) {
					var trimmedString = stringValue.trim();
					var paddedString = trimmedString;
					var numTrailingSpaces = padSpacesDefault - trimmedString.length;
					for(var i = 0; i < numTrailingSpaces; i++) {
							paddedString = paddedString + " ";
					}
					return paddedString;
		}
	}
});


app.factory('tableRenderService', function() {
	return {
		getRenderedTable: function(tableHeaderArray,tableContentJsonArray) {
			if (tableHeaderArray == null || tableHeaderArray == undefined) {
				return "Data Not Supported or Channel Not Available";
			}
				var tableHeaderString = "";
				var tableBodyString = "";
				//if (str.toLowerCase().indexOf("yes") >= 0)
				var indexPredictedColumn = -1;
				for(var i = 0; i < tableHeaderArray.length; i++) {
					tableHeaderString = tableHeaderString + "<th>" + tableHeaderArray[i] + "</th>" + "\n";
					if (tableHeaderArray[i].toLowerCase().indexOf("predicted") >= 0) {
						indexPredictedColumn = i;
					}
				}
				tableHeaderString = "<tr>" + tableHeaderString + "</tr>" + "\n";
				var predictedStartTags =  "\n" + "<h4>" + "\n" + "<span class='label label-primary'>" + "\n";
				var predictedEndTags = "</span>" + "\n" + "</h4>" + "\n";
				for(var i = 0; i < tableContentJsonArray.length; i++) {
					tableBodyString = tableBodyString + "<tr>" + "\n";
					Object.keys(tableContentJsonArray[i]).forEach(function(key,index) {
							if (indexPredictedColumn != -1 && indexPredictedColumn == index) {
									tableBodyString = tableBodyString + "<td>" + predictedStartTags + tableContentJsonArray[i][key] + predictedEndTags + "</td>" + "\n";
							} else {
								tableBodyString = tableBodyString + "<td>" + tableContentJsonArray[i][key] + "</td>" + "\n";
							}
					});
					tableBodyString = tableBodyString + "</tr>" + "\n";
				}
				var tableString = "<table class='dataframe'>" + "\n" + tableHeaderString + tableBodyString + "</table>" + "\n";
				return tableString;
		}
	}
});

app.factory('stringCapitalizeService', function() {
	return {
		capitalizeFirstLetter: function(stringArray) {
				var capitalizedStringArray = [];
				for (var i = 0; i < stringArray.length; i++) {
		    	capitalizedStringArray.push(stringArray[i].charAt(0).toUpperCase() + stringArray[i].slice(1));
				}
			return capitalizedStringArray;
		}
	}
});

app.factory('validateResultService', function() {
	return {
		validateResponse: function(jsonArray) {
			if (jsonArray == null || jsonArray == undefined || jsonArray.length == 0) {
				return [false,"No Data Found or API not Supported"];
			} else {
				return [true,"You rock dude"];
			}
		}
	}
});
