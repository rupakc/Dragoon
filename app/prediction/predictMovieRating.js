var fileOps = require('../utils/fileutils');
var textFeatureVec = require('../utils/textutils');
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');
var ML = require('ML');
var _ = require('lodash');

var getMovieRatingFromText = function(textList) {
  var deserialVocab = commonOps.deserialize(fileOps.readFromFile(constants.movieRatingTextFeatureModelPath));
  var reRegressor = ML.MultivariateLinearRegression.load(commonOps.deserialize(fileOps.readFromFile(constants.movieRatingRegressorModelPath)));
  var bowFeatures = textFeatureVec.getBagOfWordsVector(textList,deserialVocab);
  var predictedRatingList = reRegressor.predict(bowFeatures);
  predictedRatingList = _.map(predictedRatingList,function(arrayElement) {
                                if (arrayElement[0] < 1) {
                                  return 0.0;
                                } else {
                                  return arrayElement[0];
                                }
                          });
  return predictedRatingList;
}

module.exports = {
  getMovieRatingFromText: getMovieRatingFromText
}
