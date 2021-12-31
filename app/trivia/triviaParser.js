var triviaSource = require('./randomtrivia');
var _ = require('lodash');


var jeopardyParser = function(jeopardyResponseJsonList) {
  var parsedJeopardyResponseList = [];
  for (var i = 0; i < jeopardyResponseJsonList.length; i++) {
    if (jeopardyResponseJsonList[i]["value"] == 200) {
      parsedJeopardyResponseList.push({"Id": jeopardyResponseJsonList[i]["id"],
                                       "AirDate": jeopardyResponseJsonList[i]["airdate"],
                                       "Question": jeopardyResponseJsonList[i]["question"],
                                       "Answer": jeopardyResponseJsonList[i]["answer"]});
    }
  }
  return parsedJeopardyResponseList;
}

var openTriviaParser = function(openTriviaResponseJson) {
  var triviaResponseJsonList = openTriviaResponseJson["results"]
  for (var i = 0; i < triviaResponseJsonList.length; i++) {
    delete triviaResponseJsonList[i]["incorrect_answers"];
  }
  return triviaResponseJsonList;
}

var getTriviaPromiseList = function(triviaChannelList) {
  var triviaPromiseList = []
  _.forEach(triviaChannelList, function(triviaChannel) {
      if (triviaChannel == "jeopardy") {
        triviaPromiseList.push(triviaSource.jeopardyClues());
      } else if (triviaChannel == "opentrivia") {
        triviaPromiseList.push(triviaSource.openTriviaDB());
      }
  });
  return triviaPromiseList;
}

var getAggregatedParsedResponse = function(triviaChannelList) {
  var triviaPromiseList = getTriviaPromiseList(triviaChannelList);
  var parsedTriviaResponseList = []
  return new Promise(function(resolve, reject) {
        Promise.all(triviaPromiseList).then(function(promiseResponseList) {
          for (var i = 0; i < triviaChannelList.length; i++) {
            if (triviaChannelList[i] == "jeopardy") {
              parsedTriviaResponseList.push(jeopardyParser(promiseResponseList[i]));
            } else if (triviaChannelList[i] == "opentrivia") {
              parsedTriviaResponseList.push(openTriviaParser(promiseResponseList[i]));
            } else {
              parsedTriviaResponseList.push(promiseResponseList[i]);
            }
          }
          resolve(parsedTriviaResponseList);
        }, function(error) {
          reject(error);
        });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
};
