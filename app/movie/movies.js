var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');
const TVDB = require('node-tvdb');

var omdbSearch = function(search_query) {
    var queryParams = {
      "s": search_query,
      "apikey": keys.omdbApiKey
    };
    var options = {
      url: "http://www.omdbapi.com/",
      qs: queryParams
    };

    return commonutils.getPromise(options);
}

var ombdbSearchById = function(id) {
  var queryParams = {
    "i": id,
    "apikey": keys.omdbApiKey
  };
  var options = {
    url: "http://www.omdbapi.com/",
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

var movieDbMovieSearch = function(search_query) {
  var queryParams = {
    "query": search_query,
    "api_key": keys.movieDbApiKey,
    "include_adult": true
  };

  var options = {
    url: "https://api.themoviedb.org/3/search/movie",
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

var movieDbTvSearch = function(search_query) {
  var queryParams = {
    "query": search_query,
    "api_key": keys.movieDbApiKey,
    "include_adult": true
  };

  var options = {
    url: "https://api.themoviedb.org/3/search/tv",
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

var movieDbMultiSearch = function(search_query) {
  var queryParams = {
    "query": search_query,
    "api_key": keys.movieDbApiKey,
    "include_adult": true
  };

  var options = {
    url: "https://api.themoviedb.org/3/search/multi",
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

var tvDbSearch = function(search_query) {
    const tvdb = new TVDB(keys.tvDbApiKey);
    return tvdb.getSeriesByName(search_query);
}

var tvMazeSearch = function(search_query) {
  var queryParams = {
    "q": search_query
  };

  var options = {
    url: "http://api.tvmaze.com/search/shows",
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

var tvMazeScheduleSearch = function(country_code,date) {
  var queryParams = {
    "country": country_code,
    "date": date
  };

  var options = {
    url: "http://api.tvmaze.com/schedule",
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

var tasteDiveSimilarSearch = function(query_string,limit=100) {
  var queryParams = {
    "q": query_string,
    "limit": limit,
    "k": keys.tvMazeApiKey
  };

  var options = {
    url: "https://tastedive.com/api/similar",
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

module.exports = {
  omdbSearch: omdbSearch,
  ombdbSearchById: ombdbSearchById,
  movieDbMovieSearch: movieDbMovieSearch,
  movieDbTvSearch: movieDbTvSearch,
  movieDbMultiSearch: movieDbMultiSearch,
  tvDbSearch: tvDbSearch,
  tvMazeSearch: tvMazeSearch,
  tvMazeScheduleSearch: tvMazeScheduleSearch,
  tasteDiveSimilarSearch: tasteDiveSimilarSearch
};
