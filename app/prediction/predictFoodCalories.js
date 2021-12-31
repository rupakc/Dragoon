var fileOps = require('../utils/fileutils');
var textFeatureVec = require('../utils/textutils');
var commonOps = require('../utils/commonutils');
var ML = require('ml');
var constants = require('../../config/constants');
var _ = require('lodash');

var getFoodCaloriesList = function(ingredientList) {
  var deserialVocab = commonOps.deserialize(fileOps.readFromFile(constants.foodCalorieFeatureModelPath));
  var reRegressor = ML.MultivariateLinearRegression.load(commonOps.deserialize(fileOps.readFromFile(constants.foodCalorieRegressorModelPath)));
  bowFeatures = textFeatureVec.getBagOfWordsVector(ingredientList,deserialVocab);
  var predictedCalorieList = reRegressor.predict(bowFeatures);
  predictedCalorieList = _.map(predictedCalorieList,function(arrayElement) {
                                if (arrayElement[0] < 0) {
                                  return Math.abs(arrayElement[0]);
                                }
                                return arrayElement[0];
                              });
  return predictedCalorieList;
};

module.exports = {
  getFoodCaloriesList: getFoodCaloriesList
};
