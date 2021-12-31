var app = angular.module('dragoonApplication');

app.factory('tagFormatService',function() {
	return {
		  getFormattedTags: function(tagArray) {
        var startDivTags = "<div class='table-responsive'>" + '\n' + "<div class='page'>";
        var endDivTags = '</div>' + '\n' + '</div>';
        var startHeaderTags = "<h4 class='tastetag'>";
        var endHeaderTag = '</h4>';
        var htmlString = ""
        for (var i = 0; i < tagArray.length; i++) {
          htmlString = htmlString + startHeaderTags + '\n' + "<span class='label label-primary'>" + '\n';
          htmlString = htmlString + tagArray[i] + '\n' + '</span>';
          htmlString = htmlString + '\n' + endHeaderTag + '\n';
        }
        var finalFormattedString = startDivTags + htmlString + endDivTags;
        return finalFormattedString;
      }
	}
});
