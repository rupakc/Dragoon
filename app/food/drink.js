var request = require('request');
var commonutils = require('../utils/commonutils');

var punkBeer = function (beerName,foodName,type="beer") {
    punkUrl = "https://api.punkapi.com/v2/beers/";
    if (type == "food") {
    var queryParams = {
      "food": foodName
    };
  } else {
    var queryParams = {
      "beer_name": beerName
    };
  }
    var options = {
      url: punkUrl,
      qs: queryParams
    };

    return commonutils.getPromise(options);
}

var cocktail = function (search_query) {
  var cocktailUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php"
  var queryParams = {
    "s":search_query
  };
  var options = {
    url: cocktailUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
}

module.exports = {
  beer: punkBeer,
  cocktailDb: cocktail
};
