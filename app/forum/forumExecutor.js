var forumParser = require('./forumParser');
var constants = require('../../config/constants');
var closedQuestionPredictor = require('../prediction/predictClosedQuestions');
var questionRatingPredictor = require('../prediction/predictQuestionRating');
var _ = require('lodash');

var getAggregatedParsedOperationResponse = function(query,channelList,operationList) {
  if (_.includes(operationList,"closedquestionpredict")) {
    var forumPromise = forumParser.getAggregatedParsedResponse(query,channelList);
    return new Promise(function(resolve, reject) {
      forumPromise.then(function(resultList) {
        for (var i = 0; i < channelList.length; i++) {
          var questionPromiseList = [];
          var questionList = [];
          if (channelList[i] == "stackoverflow") {
            for (var j = 0; j < resultList[i].length; j++) {
              delete resultList[i][j].is_answered;
              questionList.push(resultList[i][j].title);
            }
          }
          questionPromiseList.push(closedQuestionPredictor.getPredictedQuestionStatus(questionList.join("|")));
        }

        Promise.all(questionPromiseList).then(function(questionClosedList) {
          for (var i = 0; i < questionClosedList.length; i++) {
            for (var j = 0; j < questionClosedList[i].length; j++) {
              resultList[i][j].predicted_answered = questionClosedList[i][j];
            }
          }
        resolve(resultList);
        }, function(error) {
            reject(error);
        });
      }, function(error) {
          reject(error);
      });
    });
  } else if (_.includes(operationList,"questionrating")) {
    var forumPromise = forumParser.getAggregatedParsedResponse(query,channelList);
    return new Promise(function(resolve, reject) {
      forumPromise.then(function(resultList) {
        for (var i = 0; i < channelList.length; i++) {
          var questionPromiseList = [];
          var questionList = [];
          if (channelList[i] == "stackoverflow") {
            for (var j = 0; j < resultList[i].length; j++) {
              delete resultList[i][j].score;
              questionList.push(resultList[i][j].title);
            }
          }
          questionPromiseList.push(questionRatingPredictor.getPredictedQuestionRating(questionList.join("|")));
        }

        Promise.all(questionPromiseList).then(function(questionRatingList) {
          for (var i = 0; i < questionRatingList.length; i++) {
            for (var j = 0; j < questionRatingList[i].length; j++) {
              resultList[i][j].predictedRating = questionRatingList[i][j];
            }
          }
        resolve(resultList);
        }, function(error) {
            reject(error);
        });
      }, function(error) {
          reject(error);
      });
    });
  } else {
      return forumParser.getAggregatedParsedResponse(query,channelList);
  }
}

module.exports = {
  getAggregatedParsedOperationResponse: getAggregatedParsedOperationResponse
};
