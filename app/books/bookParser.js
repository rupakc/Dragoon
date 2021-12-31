var bookSource = require('./book');
const commonutils = require('../utils/commonutils');
var _ = require('lodash');

var rsplit = function(string, sep, maxsplit) {
    var split = string.split(sep);
    return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
};

var goodReadsParserBookCover = function(goodReadsSearchResponseJson) {
  var responseJsonArray = goodReadsSearchResponseJson["GoodreadsResponse"]["search"][0]["results"][0]["work"];
  var parsedGoodReadsResponseList = []
  if (responseJsonArray == null || responseJsonArray == undefined) {
    return parsedGoodReadsResponseList;
  }
  for (var i = 0; i < responseJsonArray.length; i++) {
      var bookDetailsJson = responseJsonArray[i]["best_book"][0];
      parsedGoodReadsResponseList.push({"displayString" : "Title: " + bookDetailsJson["title"][0] + " | " +
                                        "Author: " + bookDetailsJson["author"][0]["name"][0] + " | " +
                                        "AverageRating: " + responseJsonArray[i]["average_rating"][0] + " | " +
                                        "PublicationYear: " + responseJsonArray[i]["original_publication_year"][0]["_"] + " | " +
                                        "TextReviewsCount: " + responseJsonArray[i]["text_reviews_count"][0]["_"],
                                        "ImageUrl" : bookDetailsJson["image_url"][0]});
  }
  return parsedGoodReadsResponseList;
};

var goodReadsResponseDownloadUtils = function(search_query) {
  let bookPromise = bookSource.goodReadsSearch(search_query);
  return new Promise(function(resolve, reject) {
    bookPromise.then(function(goodReadsSearchResponseJson) {
      let parsedJsonList = goodReadsParserBookCover(goodReadsSearchResponseJson);
      let imageNameUrlMap = {};
      for(let i = 0; i < parsedJsonList.length; i++) {
        imageName = rsplit(parsedJsonList[i]["ImageUrl"],'/',1)[1];
        parsedJsonList[i].ImageName = imageName;
        imageNameUrlMap[imageName] = parsedJsonList[i]["ImageUrl"];
      }
      let downloadPromise = commonutils.downloadImageListFromUrl(imageNameUrlMap);
      downloadPromise.then(function(result) {
        resolve(parsedJsonList);
      }, function(error) {
          reject(error);
      });
    }, function(error) {
        reject(error);
    });
  });
};

var goodReadsParser = function(goodReadsSearchResponseJson) {
  var responseJsonArray = goodReadsSearchResponseJson["GoodreadsResponse"]["search"][0]["results"][0]["work"];
  var parsedGoodReadsResponseList = []
  if (responseJsonArray == null || responseJsonArray == undefined) {
    return parsedGoodReadsResponseList;
  }
  for (var i = 0; i < responseJsonArray.length; i++) {
      var bookDetailsJson = responseJsonArray[i]["best_book"][0];
      parsedGoodReadsResponseList.push({"Title": bookDetailsJson["title"][0],
                                        "Author": bookDetailsJson["author"][0]["name"],
                                        "AverageRating": responseJsonArray[i]["average_rating"][0],
                                        "PublicationYear": responseJsonArray[i]["original_publication_year"][0]["_"],
                                        "TextReviewsCount": responseJsonArray[i]["text_reviews_count"][0]["_"],
                                        "RatingsCount": responseJsonArray[i]["ratings_count"][0]["_"]});
  }
  parsedGoodReadsResponseList =   _.orderBy(parsedGoodReadsResponseList, ['AverageRating'], ['desc']);
  return parsedGoodReadsResponseList;
}

var getBookPromiseList = function(search_query,bookChannelList) {
  var bookPromiseList = [];
  for (var i = 0; i < bookChannelList.length; i++) {
    if (bookChannelList[i] == "goodreads") {
      bookPromiseList.push(bookSource.goodReadsSearch(search_query));
    }
    return bookPromiseList;
  }
}

var getAggregatedParsedResponse = function(search_query,bookChannelList) {
  var bookPromiseList = getBookPromiseList(search_query,bookChannelList);
  var parsedBookResponseList = [];
  return new Promise(function(resolve, reject) {
    Promise.all(bookPromiseList).then(function(bookResponseJsonList) {
      for (var i = 0; i < bookChannelList.length; i++) {
        if (bookChannelList[i] == "goodreads") {
          parsedBookResponseList.push(goodReadsParser(bookResponseJsonList[i]));
        } else {
          parsedBookResponseList.push(bookResponseJsonList[i]);
        }
      }
      resolve(parsedBookResponseList);
    }, function(error) {
       console.log(error);
       reject(error);
    });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse,
  goodReadsParserBookCover: goodReadsParserBookCover,
  goodReadsResponseDownloadUtils: goodReadsResponseDownloadUtils
}
