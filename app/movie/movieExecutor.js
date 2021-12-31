var movieParser = require('./movieParser');
var moviePredictor = require('./moviePredictor');
var constants = require('../../config/constants');
var commonutils = require('../utils/commonutils');
var movieGenrePredictor = require('../prediction/predictMovieGenre');
var _ = require('lodash');

var getMoviePredictionPromise = function(search_query,channelList,movieOperation) {
  return new Promise(function(resolve,reject) {
      if (movieOperation != "postergenreprediction") {
        var parsedMoviePromise = movieParser.getAggregatedParsedResponse(search_query,channelList);
      }
      var movieOperationResultList = [];
      if (movieOperation == "genreprediction") {
          parsedMoviePromise.then(function(parsedResponseJsonList) {
            var movieGenrePromise = moviePredictor.getMovieGenreResultList(parsedResponseJsonList,channelList);
            movieGenrePromise.then(function(genreResponseLabelList) {
              resolve(genreResponseLabelList);
            }, function(error) {
              console.log(error);
              reject(error);
            });
          }, function(error){
              console.log(error);
              reject(error);
          });
      }
      else if (movieOperation == "castratingprediction") {
        parsedMoviePromise.then(function(resultList) {
          for (var i = 0; i < channelList.length; i++) {
            movieOperationResultList.push(moviePredictor.getMovieRatingList(resultList[i],channelList[i]));
          }
          resolve(movieOperationResultList);
        }, function(error) {
            console.log(error);
            reject(error);
        });
      }
      else if (movieOperation == "sentimentprediction") {
        parsedMoviePromise.then(function(resultList) {
          for (var i = 0; i < channelList.length; i++) {
            movieOperationResultList.push(moviePredictor.getMovieSentimentList(resultList[i],channelList[i]));
          }
          resolve(movieOperationResultList);
        }, function(error) {
          console.log(error);
          reject(error);
        });

    } else if (movieOperation == "postergenreprediction") {
        let deletePromise = commonutils.deleteAllFilesInDirectory(constants.downloadFolderPath);
          deletePromise.then(function(result) {
            let moviePromise = movieParser.parseOMDBResponseForGenre(search_query);
            moviePromise.then(function(resultList) {
              let genrePredictionPromise = movieGenrePredictor.getPredictedMovieGenrePoster();
              genrePredictionPromise.then(function(genrePredictDict) {
                for (let i = 0; i < resultList.length; i++) {
                  resultList[i].BookGenre = genrePredictDict[resultList[i].ImageUrl];
                  resultList[i].ImageUrl = "downloads/" + resultList[i].ImageUrl;
                }
                resolve([resultList]);
              }, function(error) {
                  reject(error);
              });
            }, function(error) {
                reject(error);
            });
          }, function(error) {
              reject(error);
          });
    } else {
      parsedMoviePromise.then(function(resultList){
        resolve(resultList);
      }, function(error) {
        console.log(error);
        reject(error);
      });
    }
  });
}

module.exports = {
  getMoviePredictionPromise: getMoviePredictionPromise
}
