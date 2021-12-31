var request = require('request');
var commonutils = require('../utils/commonutils');
var keys = require('../../config/keys');

var mealDB = function(search_query) {
    var mealDbUrl = "https://www.themealdb.com/api/json/v1/1/search.php";
    var propertiesObject = {"s": search_query};
    var options = {
      url:mealDbUrl,
      qs:propertiesObject
    };

    return commonutils.getPromise(options);
}

var food2Fork = function(search_query) {
  var food2ForkUrl = "http://food2fork.com/api/search";
  var api_key = keys.food2ForkKey;

  var options = {
    url:food2ForkUrl,
    qs: {"key": api_key, "q": search_query}
  };

  return commonutils.getPromise(options);
}


var edamam = function(search_query) {
  var edaUrl = "https://api.edamam.com/search";
  var appId = keys.edamamAppId;
  var appKey = keys.edamamAppKey;
  var from = 0;
  var to = 100;
  var options = {
    url: edaUrl,
    qs: {"q": search_query, "app_id": appId,
    "app_key": appKey, "from": from, "to": to },
    headers: {"Accept": "application/json", "User-Agent": "test-node-app"}
  };

  return commonutils.getPromise(options);
}

var recipePuppy = function (search_query) {
  var puppyUrl = "http://www.recipepuppy.com/api/";
  var options = {
    url: puppyUrl,
    qs: {"q": search_query}
  };

  return commonutils.getPromise(options);
}

var zomatoSearch = function(search_query) {
  var zomato = require('zomato');
  var client = zomato.createClient({
    userKey: keys.zomatoKey
  });
  client.search({
    q:search_query,
    count:"20"
    }, function(err, result){
        if(!err){
          console.log(result);
        } else {
          console.log(err);
        }
    });
}

var yummlyRecipe = function(search_query) {
  var yummlyUrl = "http://api.yummly.com/v1/api/recipes";
  var queryParams = {
    "q": search_query,
    "_app_id": keys.yummlyAppId,
    "_app_key": keys.yummlyAppKey
  };
  var options = {
    url: yummlyUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
}

module.exports = {
  puppy: recipePuppy,
  yummly: yummlyRecipe,
  zomato: zomatoSearch,
  edamamRecipe: edamam,
  food2Fork: food2Fork,
  mealDBRecipe: mealDB
};
