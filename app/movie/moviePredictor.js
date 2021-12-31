var sentimentPredictor = require('../prediction/predictSentiment');
var ratingPredictor = require('../prediction/predictMovieRating');
var textutils = require('../utils/textutils');

var sentimentPredictorHelper = function(parsedResponseJsonList,textList) {
  var sentimentLabelList = sentimentPredictor.getSentimentLabels(textList);
  for(var i = 0; i < parsedResponseJsonList.length; i++) {
    parsedResponseJsonList[i].sentiment = sentimentLabelList[i];
  }
}

var ratingPredictorHelper = function(parsedResponseJsonList,textList) {
  var ratingList = ratingPredictor.getMovieRatingFromText(textList);
  for (var i = 0; i < parsedResponseJsonList.length; i++) {
    parsedResponseJsonList[i].PredictedRating = ratingList[i];
  }
}

var getMovieRatingList = function(parsedResponseJsonList,movieSource) {
  var textList = [];
  if (movieSource == "moviedb") {
    for (var i = 0; i < parsedResponseJsonList.length; i++) {
      delete parsedResponseJsonList[i].vote_average;
      textList.push(textutils.removeNewLines(parsedResponseJsonList[i].overview));
    }
  }
  if (movieSource == "tvdb") {
    for (var i = 0; i < parsedResponseJsonList.length; i++) {
      textList.push(textutils.removeNewLines(parsedResponseJsonList[i].overview));
    }
  }
  if (movieSource == "tvmaze") {
    for (var i = 0; i < parsedResponseJsonList.length; i++) {
      delete parsedResponseJsonList[i].rating;
      textList.push(textutils.removeNewLines(parsedResponseJsonList[i].summary));
    }
  }
  ratingPredictorHelper(parsedResponseJsonList,textList);
  return parsedResponseJsonList;
}

var getMovieSentimentList = function(parsedResponseJsonList,movieSource) {
  var textList = [];
  if (movieSource == "moviedb" || movieSource == "tvdb") {
    for(var i = 0; i < parsedResponseJsonList.length; i++) {
      textList.push(parsedResponseJsonList[i]["overview"]);
    }
  }
  if (movieSource == "tvmaze") {
    for(var i = 0; i < parsedResponseJsonList.length; i++) {
        textList.push(parsedResponseJsonList[i]["summary"]);
    }
  }
  if (movieSource == "omdb") {
    for(var i = 0; i < parsedResponseJsonList.length; i++) {
        textList.push(parsedResponseJsonList[i]["Title"]);
    }
  }
  sentimentPredictorHelper(parsedResponseJsonList,textList);
  return parsedResponseJsonList;
}

var getMovieGenreResultList = function(parsedResponseJsonList,channelList) {
  var genreLabelPromiseList = [];
  for (var k = 0; k < channelList.length; k++) {
    var textList = [];
      if (channelList[k] == "moviedb" || channelList[k] == "tvdb") {
          for(var i = 0; i < parsedResponseJsonList[k].length; i++) {
              textList.push(parsedResponseJsonList[k][i]["overview"]);
          }
      }

      if (channelList[k] == "tvmaze") {
        for(var i = 0; i < parsedResponseJsonList[k].length; i++) {
            textList.push(parsedResponseJsonList[k][i]["summary"]);
        }
      }

      if (channelList[k] == "omdb") {
        for(var i = 0; i < parsedResponseJsonList[k].length; i++) {
            textList.push(parsedResponseJsonList[k][i]["Title"]);
        }
      }

      genreLabelPromiseList.push(sentimentPredictor.getMovieGenreList(textList));
  }

  return new Promise(function(resolve,reject) {
      Promise.all(genreLabelPromiseList).then(function(resultGenreLabelList) {
        for(var i = 0; i < parsedResponseJsonList.length; i++) {
          for (var j = 0; j < resultGenreLabelList[i].length; j++) {
            parsedResponseJsonList[i][j].genre = resultGenreLabelList[i][j];
          }
        }
        resolve(parsedResponseJsonList);
      }, function(error) {
          reject(error);
      });
  });
}

module.exports = {
  getMovieSentimentList: getMovieSentimentList,
  getMovieGenreResultList: getMovieGenreResultList,
  getMovieRatingList: getMovieRatingList
}
