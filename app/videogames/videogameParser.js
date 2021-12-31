var videoGameSource = require('./videogame');
var _ = require('lodash');

var giantbombParser = function(giantbombJsonResponse) {
  var resultListJson = giantbombJsonResponse["response"]["results"][0];
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

var igdbParser = function(igdbJsonResponse) {
  var bodyList = igdbJsonResponse["body"];
  if (bodyList == null || bodyList == undefined) {
    return [];
  }
  var parsedJsonIGDBList = [];
  for (var i = 0; i < bodyList.length; i++) {
    parsedJsonIGDBList.push({"Name": bodyList[i]["name"],
                            "Summary": bodyList[i]["summary"],
                            "Popularity": bodyList[i]["popularity"]});
  }
  parsedJsonIGDBList = _.orderBy(parsedJsonIGDBList, ['Popularity'], ['desc']);
  return parsedJsonIGDBList;
}

var getVideoGamePromiseList = function(search_query,channelList) {
  var promiseList = [];
  for (var i = 0; i < channelList.length; i++) {
    if (channelList[i] == "igdb") {
        promiseList.push(videoGameSource.searchIGDBGames(search_query));
    } else if (channelList[i] == "giantbomb") {
        promiseList.push(videoGameSource.getGiantBombSearchResult(search_query));
    }
  }
  return promiseList;
}

var getAggregatedParsedResponse = function(search_query,channelList) {
  var videoGamePromiseList = getVideoGamePromiseList(search_query,channelList);
  var parsedVideoGameList = [];
  return new Promise(function(resolve,reject) {
      Promise.all(videoGamePromiseList).then(function(gameResponseList) {
        for (var i = 0; i < channelList.length; i++) {
          if (channelList[i] == "igdb") {
            parsedVideoGameList.push(igdbParser(gameResponseList[i]));
          } else if (channelList[i] == "giantbomb") {
            parsedVideoGameList.push(giantbombParser(gameResponseList[i]));
          } else {
            parsedVideoGameList.push(gameResponseList[i]);
          }
        }
        resolve(parsedVideoGameList);
      }, function(error) {
          reject(error);
      });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}
