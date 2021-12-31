var bookParser = require('./bookParser');
var bookRatingPredictor = require('../prediction/predictBookRating');
var bookGenrePredictor = require('../prediction/predictBookGenre');
const bookGenrePredictorImage = require('../prediction/predictBookGenreImage');
var constants = require('../../config/constants');
var commonutils = require('../utils/commonutils');
var _ = require('lodash');

var getAggregatedParsedOperationResponse = function(search_query,channelList,operationList) {
  if (_.includes(operationList,"ratingprediction")) {
    var bookPromise = bookParser.getAggregatedParsedResponse(search_query,channelList);
    return new Promise(function(resolve, reject) {
      bookPromise.then(function(resultList) {
        var ratingPromiseList = [];
        for (var i = 0; i < channelList.length; i++) {
          if (channelList[i] == "goodreads") {
            var resultJsonList = resultList[i];
            var authorTitleList = []
            for (var j = 0; j < resultJsonList.length; j++) {
              delete resultJsonList[j].AverageRating;
              authorTitleList.push(resultJsonList[j].Title + " " + resultJsonList[j].Author);
            }
            ratingPromiseList.push(bookRatingPredictor.getPredictedBookRating(authorTitleList));
          }
        }
        Promise.all(ratingPromiseList).then(function(predictedRatingList) {
          for (var i = 0; i < channelList.length; i++) {
            for (var j = 0; j < predictedRatingList[i].length; j++) {
              resultList[i][j].PredictedRating = predictedRatingList[i][j];
            }
          }
          resolve(resultList);
        }, function(error) {
            console.log(error);
            reject(error);
        });
      }, function(error) {
          console.log(error);
          reject(error);
      });
    });
  } else if (_.includes(operationList,"genreprediction")) {
    var bookPromise = bookParser.getAggregatedParsedResponse(search_query,channelList);
    return new Promise(function(resolve, reject) {
      bookPromise.then(function(resultList) {
        var genrePromiseList = [];
        for (var i = 0; i < channelList.length; i++) {
          if (channelList[i] == "goodreads") {
            var resultJsonList = resultList[i];
            var authorTitleList = [];
            for (var j = 0; j < resultJsonList.length; j++) {
              authorTitleList.push(resultJsonList[j].Title + " " + resultJsonList[j].Author);
            }
            genrePromiseList.push(bookGenrePredictor.getPredictedBookGenre(authorTitleList.join("|")));
          }
        }
        Promise.all(genrePromiseList).then(function(predictedGenreList) {
          for (var i = 0; i < channelList.length; i++) {
            for (var j = 0; j < predictedGenreList[i].length; j++) {
              resultList[i][j].PredictedGenre = predictedGenreList[i][j];
            }
          }
          resolve(resultList);
        }, function(error) {
            console.log(error);
            reject(error);
        });
      }, function(error) {
          console.log(error);
          reject(error);
      });
    });
  } else if (_.includes(operationList,"genrepredictionimage")) {
      let deletePromise = commonutils.deleteAllFilesInDirectory(constants.downloadFolderPath);
      return new Promise(function(resolve, reject) {
        deletePromise.then(function(result) {
            let bookPromise = bookParser.goodReadsResponseDownloadUtils(search_query);
            bookPromise.then(function(resultJsonList) {
              let predictionPromise = bookGenrePredictorImage.getPredictedBookGenreImage();
              predictionPromise.then(function(genrePredictDict) {
                for (let i = 0; i < resultJsonList.length; i++) {
                  resultJsonList[i].BookGenre = genrePredictDict[resultJsonList[i]["ImageName"]]
                  resultJsonList[i].ImageUrl = "downloads/" + resultJsonList[i].ImageName
                }
                resolve([resultJsonList]);
              }, function(error) {
                  reject(error);
              });
            }, function(error) {
                reject(error);
            });
        }, function(error) {
            reject(error);
        });
     });
  } else {
      return bookParser.getAggregatedParsedResponse(search_query,channelList);
  }
}

module.exports = {
  getAggregatedParsedOperationResponse: getAggregatedParsedOperationResponse
}
