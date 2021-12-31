var triviaParser = require('./triviaParser');
var constants = require('../../config/constants');
var questionTypePredictor = require('../prediction/predictTriviaQuestionType');
var _ = require('lodash');

var getAggregatedParsedOperationResponse = function(triviaChannelList,operationList) {
  if (_.includes(operationList,"questiontypepredictor")) {
    var triviaPromise = triviaParser.getAggregatedParsedResponse(triviaChannelList);
    return new Promise(function(resolve, reject) {
      triviaPromise.then(function(resultList) {
        var triviaPromiseList = [];
        for (var i = 0; i < triviaChannelList.length; i++) {
          var triviaQuestionList = [];
          if (triviaChannelList[i] == "opentrivia") {
            for (var j = 0; j < resultList[i].length; j++) {
              delete resultList[i][j].category;
              triviaQuestionList.push(resultList[i][j].question);
            }
          }
          triviaPromiseList.push(questionTypePredictor.getPredictedQuestionTypes(triviaQuestionList.join("|")));
        }
        Promise.all(triviaPromiseList).then(function(predictedCategoryList) {
          for (var i = 0; i < triviaChannelList.length; i++) {
            for (var j = 0; j < predictedCategoryList[i].length; j++) {
              if (triviaChannelList[i] == "opentrivia") {
                resultList[i][j].predictedCategory = predictedCategoryList[i][j];
              }
            }
          }
        resolve(resultList);
        }, function(error) {
            reject(error);
        });
      }, function(error) {
          console.log(error);
          reject(error);
      });
    });
  } else {
    return triviaParser.getAggregatedParsedResponse(triviaChannelList);
  }
}

module.exports = {
  getAggregatedParsedOperationResponse: getAggregatedParsedOperationResponse
};
