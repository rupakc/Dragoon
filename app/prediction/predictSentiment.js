var Sentiment = require('sentiment');
var constants = require('../../config/constants');
var sentiment = new Sentiment();
var mcc = require('../db/memcachedconnector');
var natural = require('natural');

var getMovieGenreList = function(textList) {
  return new Promise(function(resolve,reject) {
      var classifierProm = mcc.getMemcachedValue("movie_genre_naive_bayes");
      var genreLabelList = [];
      classifierProm.then(function(result) {
        var restoredClassifier = natural.BayesClassifier.restore(JSON.parse(result));
        for (var i = 0; i < textList.length; i++) {
            genreLabelList.push(restoredClassifier.classify(textList[i]));
        }
        resolve(genreLabelList);
      }, function(error) {
        console.log(error);
        reject(error);
      });
  });
}

var getSentimentLabels = function(textList) {
  var sentimentLabels = [];
  for(var i = 0; i < textList.length; i++) {
    var resultJson = sentiment.analyze(textList[i]);
    var resultScore = resultJson["score"];
    if (resultScore == 0) {
      sentimentLabels.push(constants.sentimentNeutral);
    } else if (resultScore > 0) {
      sentimentLabels.push(constants.sentimentPositive);
    } else {
      sentimentLabels.push(constants.sentimentNegative);
    }
  }
  return sentimentLabels;
}

module.exports = {
  getSentimentLabels: getSentimentLabels,
  getMovieGenreList: getMovieGenreList
}
