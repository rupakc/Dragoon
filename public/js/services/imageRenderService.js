var app = angular.module('dragoonApplication');

app.factory('imageRenderService', function() {
	return {
		renderImages: function(responseJsonList) {
      var headerHtml = "<div class='col'>" + "\n" + "<div class='col-md-4'>" + "\n" +
                        "<div class='thumbnail custom-thumb' style='width:auto;height:300px'>" + "\n";
      var masterImageHtmlString = "";
      for (var i = 0; i < responseJsonList.length; i++) {
        var imageResponse = responseJsonList[i];
        var imageDisplayHtml = headerHtml + "<a href=" + "'" + imageResponse["ImageUrl"] + "'" + " target='_blank'>" + "\n";
        imageDisplayHtml = imageDisplayHtml + "<div class='text-center custom-img'>" + "\n" + "<img src=" + "'" + imageResponse["ImageUrl"] + "'" +
                          " style='width:auto;height:200px'" + " alt='Image Should Have Been here Fuck !!!'>" + "\n" + "</div>" + "\n";
        imageDisplayHtml = imageDisplayHtml + "<div class='caption'>" + "\n" + "<p>" + imageResponse["displayString"] + "</p>" + "\n"
                           + "</div>" + "\n" + "</a>";
        imageDisplayHtml = imageDisplayHtml + "<div class='text-center'>" + "\n" + "<h4>" + "\n" + "<span class='label label-primary'>" + "\n"
                           + imageResponse["BookGenre"] + "\n" +"</span>" + "\n" + "</h4>" + "\n" + "</div>" + "\n";
        imageDisplayHtml = imageDisplayHtml  + "</div>" + "\n" + "</div>" + "\n" + "</div>" + "\n";

        masterImageHtmlString = masterImageHtmlString + imageDisplayHtml;
      }
      return masterImageHtmlString;
		}
	}
});
