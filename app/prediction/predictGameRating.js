var fileOps = require('../utils/fileutils');
var textFeatureVec = require('../utils/textutils');
var commonOps = require('../utils/commonutils');
var _ = require('lodash');
var ML = require('ml');
var videoGameData = require('../videogames/videogameParser');
var constants = require('../../config/constants');

var getGameRating = function(search_query) {
  var videoGameProm = videoGameData.getAggregatedParsedResponse(search_query,constants.supportGameRatingChannels);
  var deserialVocab = commonOps.deserialize(fileOps.readFromFile(constants.gameRatingFeatureModelPath));
  var deserialRegressor = ML.MultivariateLinearRegression.load(commonOps.deserialize(fileOps.readFromFile(constants.gameRatingRegressorModelPath)));
  return new Promise(function(resolve, reject) {
    videoGameProm.then(function(result) {
      var textSummaryList = [];
      var resultList = result[0];
      for (var i = 0; i < resultList.length; i++) {
        var summary = resultList[i].Summary;
        delete resultList[i].Popularity;
        if (summary == undefined) {
          summary = "sample";
        }
        summary = textFeatureVec.removeNewLines(summary);
        textSummaryList.push(summary);
      }
      var predictedRatingList = deserialRegressor.predict(textFeatureVec.getBagOfWordsVector(textSummaryList,deserialVocab));
      predictedRatingList = _.map(predictedRatingList, function(arrayElement) {
                            if (arrayElement[0] < 0) {
                              return Math.abs(arrayElement[0]);
                            }
                            return arrayElement[0];
                          });
      for (var i = 0; i < resultList.length; i++) {
        resultList[i].PredictedRating = predictedRatingList[i]
      }
      resolve([resultList]);
    }, function(error) {
      console.log(error);
      reject(error);
    });
  });
}

module.exports = {
  getGameRating: getGameRating
}
