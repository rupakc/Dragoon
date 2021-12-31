var foodParser = require('./foodParser');
var cuisinePredictor = require('../prediction/predictCuisine');
var ratingPredictor = require('../prediction/predictFoodRating');
var caloriePredictor = require('../prediction/predictFoodCalories');
var ingredientPredictor = require('../prediction/predictFoodIngredients');
var constants = require('../../config/constants');
var textutils = require('../utils/textutils');
var _ = require('lodash');

var caloriePredictionHelper = function(parsedJsonList,ingredientList) {
  var predictedCalorieList = caloriePredictor.getFoodCaloriesList(ingredientList);
  for (var i = 0; i < parsedJsonList.length; i++) {
    parsedJsonList[i].PredictedCalories = predictedCalorieList[i];
  }
}

var getAggregatedParsedOperationResponse = function(search_query,channelList,operationList) {
  if (_.includes(operationList,"cuisineprediction")) {
    channelList = constants.supportedCuisineChannels;
    var foodPromise = foodParser.getAggregatedParsedResponse(search_query,channelList);
    return new Promise(function(resolve, reject) {
        foodPromise.then(function(resultList) {
          for (var k = 0; k < resultList.length; k++) {
            var mealResponseList = resultList[k];
            var instructionList = []
            for (var i = 0; i < mealResponseList.length; i++) {
              delete mealResponseList[i]["Area"];
              instructionList.push(mealResponseList[i]["Instructions"]);
            }
            var predictedCuisineList = cuisinePredictor.getFoodCuisine(instructionList);
            for (var i = 0; i < predictedCuisineList.length; i++) {
              mealResponseList[i]["PredictedCuisine"] = predictedCuisineList[i];
            }
        }
        resolve(resultList);
        }, function(error) {
            console.log(error);
            reject(error);
        });
    });
  } else if (_.includes(operationList,"ratingprediction")) {
      var foodPromise = foodParser.getAggregatedParsedResponse(search_query,channelList);
      return new Promise(function(resolve, reject) {
          foodPromise.then(function(resultList) {
            for (var i = 0; i < channelList.length; i++) {
              if (channelList[i] == "yummly") {
                var resultResponseList = resultList[i];
                var foodDescriptionList = [];
                for (var j = 0; j < resultResponseList.length; j++) {
                  var ingredientsListString = resultResponseList[j].Ingredients.join(" ");
                  delete resultResponseList[j].Rating;
                  var title = resultResponseList[j].Name;
                  foodDescriptionList.push(ingredientsListString + " " + title);
                }
                var foodRatingList = ratingPredictor.getFoodRating(foodDescriptionList);
                for (var j = 0; j < resultResponseList.length; j++) {
                  resultResponseList[j].PredictedRating = foodRatingList[j];
                }
              } else if (channelList[i] == "recipepuppy") {
                var resultResponseList = resultList[i];
                var foodDescriptionList = [];
                for (var j = 0; j < resultResponseList.length; j++) {
                  var ingredientsString = resultResponseList[j].Ingredients.split(',').join(" ");
                  var title = resultResponseList[j].Title;
                  foodDescriptionList.push(ingredientsString + " " + title);
                }
                var foodRatingList = ratingPredictor.getFoodRating(foodDescriptionList);
                for (var j = 0; j < resultResponseList.length; j++) {
                  resultResponseList[j].PredictedRating = foodRatingList[j];
                }
              }
            }
            resolve(resultList);
          }, function(error) {
              console.log(error);
              reject(error);
        });
      });
  } else if (_.includes(operationList,"calorieprediction")) {
      var foodPromise = foodParser.getAggregatedParsedResponse(search_query,channelList);
      return new Promise(function(resolve, reject) {
        foodPromise.then(function(resultList) {
            for (var i = 0; i < channelList.length; i++) {
              var ingredientList = [];
              if (channelList[i] == "edamam") {
                var resultJsonList = resultList[i];
                for (var j = 0; j < resultJsonList.length; j++) {
                  ingredientList.push(resultJsonList[j].Ingredients.join(" "));
                  delete resultJsonList[i].Calories;
                }
              }
              if (channelList[i] == "yummly") {
                var resultJsonList = resultList[i];
                for (var j = 0; j < resultJsonList.length; j++) {
                  ingredientList.push(resultJsonList[j].Ingredients.join(" "));
                }
              }
              if (channelList[i] == "recipepuppy") {
                var resultJsonList = resultList[i];
                for (var j = 0; j < resultJsonList.length; j++) {
                  ingredientList.push(resultJsonList[j].Ingredients.split(",").join(" "));
                }
              }
              caloriePredictionHelper(resultList[i],ingredientList);
            }
            resolve(resultList);
          }, function(error) {
              console.log(error);
              reject(error);
         });
      });
  } else if (_.includes(operationList,"ingredientprediction")) {
    var foodPromise = foodParser.getAggregatedParsedResponse(search_query,channelList);
    return new Promise(function(resolve, reject) {
      foodPromise.then(function(resultList) {
        var ingredientPromiseList = [];
        for (var i = 0; i < channelList.length; i++) {
          var recipeNameList = [];
          var resultJsonList = resultList[i];
          if (channelList[i] == "yummly") {
            for (var j = 0; j < resultJsonList.length; j++) {
              delete resultJsonList[j].Ingredients;
              recipeNameList.push(resultJsonList[j].Name);
            }
          }
          if (channelList[i] == "edamam") {
            for (var j = 0; j < resultJsonList.length; j++) {
              delete resultJsonList[j].Ingredients;
              recipeNameList.push(textutils.removeBrackets(resultJsonList[j].Label));
            }
          }
          if (channelList[i] == "recipepuppy") {
            for (var j = 0; j < resultJsonList.length; j++) {
              delete resultJsonList[j].Ingredients;
              recipeNameList.push(resultJsonList[j].Title);
            }
          }
          ingredientPromiseList.push(ingredientPredictor.getPredictedFoodIngredients(recipeNameList));
        }
        Promise.all(ingredientPromiseList).then(function(ingredientResultList) {
          for (var i = 0; i < ingredientResultList.length; i++) {
            for (var j = 0; j < resultList[i].length; j++) {
              resultList[i][j].PredictedIngredients = ingredientResultList[i][j];
            }
          }
          resolve(resultList);
        }, function(error) {
            console.log(error);
            reject(error);
        });
      }, function(error) {
          console.log(error);
          reject(error);
      });
    });
  } else {
      return foodParser.getAggregatedParsedResponse(search_query,channelList);
  }
};

module.exports = {
  getAggregatedParsedOperationResponse: getAggregatedParsedOperationResponse
};
