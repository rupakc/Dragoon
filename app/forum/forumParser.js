var stackExchange = require('./stackexchange');

var stackExchangeParser = function(stackResponseJson) {
  var itemJsonArray = stackResponseJson["items"];
  for (var i = 0; i < itemJsonArray.length; i++) {
    delete itemJsonArray[i]["owner"];
  }
  return itemJsonArray;
}

var getForumPromiseList = function(search_query,forumChannelList) {
  var forumPromiseList = [];
  for (var i = 0; i < forumChannelList.length; i++) {
    if (forumChannelList[i] == "stackoverflow") {
      forumPromiseList.push(stackExchange.stackExchangeData(search_query));
    }
  }
  return forumPromiseList;
}

var getAggregatedParsedResponse = function(search_query,forumChannelList) {
  var forumPromiseList = getForumPromiseList(search_query,forumChannelList);
  var parsedResponseList = [];
  return new Promise(function(resolve,reject) {
      Promise.all(forumPromiseList).then(function(resultList) {
        for (var i = 0; i < forumChannelList.length; i++) {
          if (forumChannelList[i] == "stackoverflow") {
            parsedResponseList.push(stackExchangeParser(resultList[i]));
          } else {
            parsedResponseList.push(resultList[i]);
          }
        }
      resolve(parsedResponseList);
      }, function(error) {
          reject(error);
      });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}

// var promise = getAggregatedParsedResponse("python",["stackoverflow"]);
//
// promise.then(function(result) {
//     console.log(result);
// }, function(error) {
//     console.log(error);
// });
