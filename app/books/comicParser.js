var comicSource = require('./comics');
var _ = require('lodash');

var comicvineParser = function(comicvineJsonResponse) {
  var resultListJson = comicvineJsonResponse["response"]["results"][0];
  if (resultListJson == null || resultListJson == undefined) {
    return [];
  }
  var flattendResponseJsonList = _.flattenDepth(_.values(resultListJson),1);
  var parsedBombResponseList = []
  for (var i = 0; i < flattendResponseJsonList.length; i++) {
    parsedBombResponseList.push({"Alias": flattendResponseJsonList[i]["aliases"][0],
                                "Date": flattendResponseJsonList[i]["date_last_updated"][0],
                                "Deck": flattendResponseJsonList[i]["deck"][0],
                                "Description": flattendResponseJsonList[i]["description"][0],
                                "Name": flattendResponseJsonList[i]["name"][0]});
  }
  return parsedBombResponseList;
}


var marvelComicsParser = function(marvelResponseJson) {
  var resultList = marvelResponseJson["data"]["results"];
  if (resultList == null || resultList == undefined) {
    return [];
  }
  var parsedMarvelComicResponseList = [];
  for (var i = 0; i < resultList.length; i++) {
    parsedMarvelComicResponseList.push({"Id": resultList[i]["id"],
                                    "Name": resultList[i]["name"],
                                    "Description": resultList[i]["description"],
                                    "Modified": resultList[i]["modified"]});
  }
  return parsedMarvelComicResponseList;
};

var getComicPromiseList = function(search_query,comicChannelList) {
  var comicsPromiseList = [];
  for (var i = 0; i < comicChannelList.length; i++) {
    if (comicChannelList[i] == "marvelcomics") {
      comicsPromiseList.push(comicSource.marvelInfoData(search_query));
    } else if (comicChannelList[i] == "comicvine") {
      comicsPromiseList.push(comicSource.comicVineResponseData(search_query));
    }
  }
  return comicsPromiseList;
};

var getAggregatedParsedResponse = function(search_query,comicChannelList) {
  var comicsPromiseList = getComicPromiseList(search_query,comicChannelList);
  var parsedComicsResponseList = [];
  return new Promise(function(resolve,reject) {
      Promise.all(comicsPromiseList).then(function(comicsResponseList) {
        for (var i = 0; i < comicChannelList.length; i++) {
            if (comicChannelList[i] == "marvelcomics") {
              parsedComicsResponseList.push(marvelComicsParser(comicsResponseList[i]));
            } else if (comicChannelList[i] == "comicvine") {
              parsedComicsResponseList.push(comicvineParser(comicsResponseList[i]));
            } else {
              parsedComicsResponseList.push(comicsResponseList[i]);
            }
        }
        resolve(parsedComicsResponseList);
      }, function(error) {
        reject(error);
      });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}
