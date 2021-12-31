var movieSource = require('./movies');
var moviePrediction = require('./moviePredictor');
var commonutils = require('../utils/commonutils');

var rsplit = function(string, sep, maxsplit) {
    var split = string.split(sep);
    return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
};

var parseOMDBResponse = function(omdbResponse) {
  var resultList = omdbResponse["Search"]
  for(var i = 0; i < resultList.length; i++) {
    delete resultList[i].Poster;
  }
  return resultList;
}

var parseOMDBResponseForGenre = function(search_query) {
  let moviePromise = movieSource.omdbSearch(search_query);
  return new Promise(function(resolve, reject) {
    moviePromise.then(function(omdbResponse) {
      let resultList = omdbResponse["Search"];
      let posterNameUrlMap = {};
      for(let i = 0; i < resultList.length; i++) {
        posterName = rsplit(resultList[i].Poster,'/',1)[1];
        posterNameUrlMap[posterName] = resultList[i].Poster;
        resultList[i].displayString = "Title: " + resultList[i].Title + " | " + "Year: " + resultList[i].Year;
        resultList[i].ImageUrl = posterName;
        delete resultList[i].Title;
        delete resultList[i].Year;
        delete resultList[i].Poster;
        delete resultList[i].Type;
        delete resultList[i].imdbID;
      }
      let downloadPromise = commonutils.downloadImageListFromUrl(posterNameUrlMap);
      downloadPromise.then(function(result) {
        resolve(resultList);
      }, function(error) {
          reject(error);
      });
    }, function(error) {
        reject(error);
    });
  });
}

var parseMovieDBResponse = function(movieDBResponse) {
  var resultList = movieDBResponse["results"];
  var fields_to_delete = ["id","video","poster_path","genre_ids",
                          "backdrop_path","release_date","adult","original_title"];
  for (var i = 0; i < resultList.length; i++) {
    fields_to_delete.forEach(key => delete resultList[i][key]);
  }
  return resultList;
}

var parseTvDBResponse = function(tvDBResponse) {
  var resultList = tvDBResponse;
  var fields_to_delete = ["aliases","banner","id"];
  for (var i = 0; i < resultList.length; i++) {
    fields_to_delete.forEach(key => delete resultList[i][key]);
  }
  return resultList;
}

var parseTvMazeResponse = function(tvMazeResponse) {
  var resultList = tvMazeResponse;
  var fields_to_delete = ["runtime","url","id","updated","_links","image",
  "externals","webChannel","network","weight","schedule","officialSite"];
  for (var i = 0; i < resultList.length; i++) {
    var showJson = resultList[i]["show"];
    fields_to_delete.forEach(key => delete showJson[key]);
    showJson["rating"] = showJson["rating"]["average"];
    resultList[i] = showJson
  }
  return resultList;
}

var parseTasteDiveResponse = function(tasteDiveResponse) {
  var resultList = tasteDiveResponse["Similar"]["Results"];
  var extractedResultList = [];
  for (var i = 0; i < resultList.length; i++) {
    extractedResultList.push(resultList[i]["Name"]);
  }
  return extractedResultList;
}

var getAggregatedParsedResponse = function(search_query,channelList,movieOperation) {
    var promiseList = [];
    for (var i = 0; i < channelList.length; i++) {
      if (channelList[i] == "omdb") {
        promiseList.push(movieSource.omdbSearch(search_query));
      } else if (channelList[i] == "moviedb") {
        promiseList.push(movieSource.movieDbMovieSearch(search_query));
      } else if (channelList[i] == "tvdb") {
        promiseList.push(movieSource.tvDbSearch(search_query));
      } else if (channelList[i] == "tvmaze") {
        promiseList.push(movieSource.tvMazeSearch(search_query));
      } else if (channelList[i] == "tastedive") {
        promiseList.push(movieSource.tasteDiveSimilarSearch(search_query));
      }
    }

  return new Promise(function(resolve,reject) {
     Promise.all(promiseList).then(function(resultList) {
      responseList = [];
      for(var i = 0; i < resultList.length; i++) {
        var promiseResult = resultList[i];
        if (channelList[i] == "moviedb") {
          responseList.push(parseMovieDBResponse(promiseResult));
        } else if (channelList[i] == "omdb") {
          responseList.push(parseOMDBResponse(promiseResult));
        } else if (channelList[i] == "tvdb") {
            responseList.push(parseTvDBResponse(promiseResult));
        } else if (channelList[i] == "tvmaze") {
          responseList.push(parseTvMazeResponse(promiseResult));
        } else if (channelList[i] == "tastedive") {
          responseList.push(parseTasteDiveResponse(promiseResult));
        }
      }
      resolve(responseList);
    });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse,
  parseOMDBResponseForGenre: parseOMDBResponseForGenre
};
