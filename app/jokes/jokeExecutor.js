var jokeParser = require('./jokeParser');
var constants = require('../../config/constants');
var jokeGenerator = require('../prediction/generateChuckNorrisjokes');
var _ = require('lodash');

var getAggregatedParsedOperationResponse = function(search_query,channelList,operationList) {
  if (_.includes(operationList,'jokegenerator')) {
    channelList = constants.supportedJokeGenerationChannels;
    var generatedJokePromiseList = [];
    for (var i = 0; i < channelList.length; i++) {
      generatedJokePromiseList.push(jokeGenerator.getGeneratedJokes(channelList[i]));
    }
    return new Promise(function(resolve, reject) {
      Promise.all(generatedJokePromiseList).then(function(generatedJokeList) {
          var resultList = [];
          for (var i = 0; i < generatedJokeList.length; i++) {
            var jokeJsonList = [];
            for (var j = 0; j < generatedJokeList[i].length; j++) {
              jokeJsonList.push({"Generated Joke": generatedJokeList[i][j]});
            }
            resultList.push(jokeJsonList);
          }
        resolve(resultList);
      }, function(error) {
          console.log(error);
          reject(error);
      });
    });
  } else {
      return jokeParser.getAggregatedParsedResponse(search_query,channelList);
  }
}

module.exports = {
  getAggregatedParsedOperationResponse: getAggregatedParsedOperationResponse
};

// var prom = getAggregatedParsedOperationResponse('blie',['yomama','chuckjokes'],["jokegenerator"]);
// prom.then(function(result) {
//   console.log(result);
// }, function(error) {
//   console.log(error);
// });
