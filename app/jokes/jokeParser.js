var jokeSource = require('./joke');

var yoMamaParser = function(yoMamaResponseJson) {
  return yoMamaResponseJson;
}

var chuckNorrisParser = function(chuckNorrisResponseJson) {
  var valueArrayJson = chuckNorrisResponseJson["value"];
  var parsedJokeArray = [];
  for (var i = 0; i < valueArrayJson.length; i++) {
    parsedJokeArray.push({"Joke": valueArrayJson[i]["joke"]});
  }
  return parsedJokeArray;
}

var randomTenDevJokesParser = function(randomTenDevResponseJson) {
  for (var i = 0; i < randomTenDevResponseJson.length; i++) {
    delete randomTenDevResponseJson[i].id;
  }
  return randomTenDevResponseJson;
}

var icanHazDadJokeParser = function(icanHazDadResponseJson) {
  return icanHazDadResponseJson["results"];
}

var getJokePromiseList = function(search_query,channelList) {
    var jokePromiseList = [];
    for (var i = 0; i < channelList.length; i++) {
      if (channelList[i] == "chuckjokes") {
        jokePromiseList.push(jokeSource.getChuckNorrisJokes());
      } else if (channelList[i] == "randtendev") {
        jokePromiseList.push(jokeSource.getRandomTenDevJokes());
      } else if (channelList[i] == "icanhazdad") {
        jokePromiseList.push(jokeSource.getIcanHazDadJokes(search_query));
      } else if (channelList[i] == "yomama") {
        jokePromiseList.push(jokeSource.getYoMamaJokes());
      }
    }
  return jokePromiseList;
}

var getAggregatedParsedResponse = function(search_query,channelList) {
  var jokePromiseList = getJokePromiseList(search_query,channelList);
  var parsedJokeResponseList = [];
  return new Promise(function(resolve,reject) {
      Promise.all(jokePromiseList).then(function(jokeResponseList) {
        for (var i = 0;i <= channelList.length; i++) {
          if (channelList[i] == "chuckjokes") {
              parsedJokeResponseList.push(chuckNorrisParser(jokeResponseList[i]));
          } else if (channelList[i] == "randtendev") {
              parsedJokeResponseList.push(randomTenDevJokesParser(jokeResponseList[i]));
          } else if (channelList[i] == "icanhazdad") {
            parsedJokeResponseList.push(icanHazDadJokeParser(jokeResponseList[i]));
          } else if (channelList[i] == "yomama") {
            parsedJokeResponseList.push(yoMamaParser(jokeResponseList[i]));
          } else {
            parsedJokeResponseList.push(jokeResponseList[i]);
          }
        }
        parsedJokeResponseList.length = channelList.length;
        resolve(parsedJokeResponseList);
      }, function(error) {
        reject(error);
      });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}
