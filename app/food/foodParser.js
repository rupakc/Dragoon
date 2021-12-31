var foodSource = require('./food');
var _ = require('lodash');

var food2ForkParser = function(food2ForkJsonResponse) {
  var recipeList = food2ForkJsonResponse["recipes"];
  if (recipeList == null || recipeList == undefined || recipeList.length == 0) {
      return [];
  }
  for (var i = 0; i < recipeList.length; i++) {
    delete recipeList[i]["source_url"];
    delete recipeList[i]["image_url"];
  }
  return recipeList;
}

var edamamParser = function(edamamResponseJson) {
  var hitList = edamamResponseJson["hits"];
  var ingredientParser = function(jsonElement) {
    return jsonElement["text"];
  };
  var parsedEdamamResponseList = [];
  if (hitList == null || hitList == undefined) {
    return parsedEdamamResponseList;
  }

  for (var i = 0; i < hitList.length; i++) {
    var recipeJson = hitList[i]["recipe"];
    parsedEdamamResponseList.push({"Label": recipeJson["label"],
                                  "Source": recipeJson["source"],
                                  "DietLabels": recipeJson["dietLabels"],
                                  "HealthLabels": recipeJson["healthLabels"],
                                  "IngredientLines": recipeJson["ingredientLines"],
                                  "Ingredients": _.map(recipeJson["ingredients"],ingredientParser),
                                  "Calories": recipeJson["calories"]});
  }

  return parsedEdamamResponseList;
}

var yummlyParser = function(yummlyResponseJson) {
  var resultList = yummlyResponseJson["matches"];
  var parsedYummlyResponseList = [];
  if (resultList == null || resultList == undefined) {
    return parsedYummlyResponseList;
  }

  for (var i = 0; i < resultList.length; i++) {
    parsedYummlyResponseList.push({"Name": resultList[i]["recipeName"],
                                  "Ingredients": resultList[i]["ingredients"],
                                  "Flavors": _.keys(resultList[i]["flavors"]),
                                  "Rating": resultList[i]["rating"]});
  }

  return parsedYummlyResponseList;
}

var recipePuppyParser = function(puppyJsonResponse) {
  var resultList = puppyJsonResponse["results"];
  var parsedResultJsonList = [];
  if (resultList == null || resultList == undefined) {
    return parsedResultJsonList;
  }
  for (var i = 0; i < resultList.length; i++) {
    parsedResultJsonList.push({"Title": resultList[i]["title"],
                              "Ingredients": resultList[i]["ingredients"]});
  }
  return parsedResultJsonList;
}

var mealDBParser = function(mealDBJsonResponse) {
  var mealResultList = mealDBJsonResponse["meals"];
  var parsedMealResultList = [];
  if (mealResultList == null || mealResultList == undefined) {
      return parsedMealResultList;
  }

  for (var i = 0; i < mealResultList.length; i++) {
    parsedMealResultList.push({"Meal": mealResultList[i]["strMeal"],
                               "Category": mealResultList[i]["strCategory"],
                               "Area": mealResultList[i]["strArea"],
                               "Instructions": mealResultList[i]["strInstructions"],
                               "Tags": mealResultList[i]["strTags"]});
  }

  return parsedMealResultList;
}

var getFoodPromiseList = function(search_query,foodChannelList) {
  var foodPromiseList = [];
  for (var i = 0; i < foodChannelList.length; i++) {
    if (foodChannelList[i] == "recipepuppy") {
      foodPromiseList.push(foodSource.puppy(search_query));
    } else if (foodChannelList[i] == "yummly") {
      foodPromiseList.push(foodSource.yummly(search_query));
    } else if (foodChannelList[i] == "food2fork") {
      foodPromiseList.push(foodSource.food2Fork(search_query));
    } else if (foodChannelList[i] == "edamam") {
      foodPromiseList.push(foodSource.edamamRecipe(search_query));
    } else if (foodChannelList[i] == "mealdb") {
      foodPromiseList.push(foodSource.mealDBRecipe(search_query));
    }
  }
  return foodPromiseList;
}

var getAggregatedParsedResponse = function(search_query,foodChannelList) {
  var foodPromiseList = getFoodPromiseList(search_query,foodChannelList);
  var parsedFoodResponseList = [];
  return new Promise(function(resolve,reject) {
      Promise.all(foodPromiseList).then(function(foodResponseResultList) {
        for (var i = 0; i < foodChannelList.length; i++) {
          if (foodChannelList[i] == "recipepuppy") {
            parsedFoodResponseList.push(recipePuppyParser(foodResponseResultList[i]));
          } else if (foodChannelList[i] == "mealdb") {
            parsedFoodResponseList.push(mealDBParser(foodResponseResultList[i]));
          } else if (foodChannelList[i] == "yummly") {
            parsedFoodResponseList.push(yummlyParser(foodResponseResultList[i]));
          }  else if (foodChannelList[i] == "edamam") {
            parsedFoodResponseList.push(edamamParser(foodResponseResultList[i]));
          } else if (foodChannelList[i] == "food2fork") {
            parsedFoodResponseList.push(food2ForkParser(foodResponseResultList[i]));
          } else {
            parsedFoodResponseList.push(foodResponseResultList[i]);
          }
        }
        resolve(parsedFoodResponseList);
      }, function(error) {
        reject(error);
      });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}
