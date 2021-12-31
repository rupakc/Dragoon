var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');

var getChuckNorrisJokes = function(max_count=20) {
  var baseUrl = "http://api.icndb.com/jokes/random/";
  var finalUrl = baseUrl + max_count
  var options = {
    url: finalUrl
  };

  return commonutils.getPromise(options);
};

var getRandomTenDevJokes = function() {
  var baseUrl = "https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten";
  var options = {
    url: baseUrl
  };

  return commonutils.getPromise(options);
}

var getIcanHazDadJokes = function(search_query) {
  var baseUrl = "https://icanhazdadjoke.com/search";
  var options = {
    url: baseUrl,
    qs: {"term": search_query},
    headers: {"Accept": "application/json"}
  }

  return commonutils.getPromise(options);
};

var getYoMamaJokes = function(max_count=20) {
  var baseUrl = "http://api.yomomma.info/";
  var jokeSet = new Set();
  var options = {
    url: baseUrl,
    headers: {"Accept": "application/json"}
  };
 var promiseList = [];
 for (var i = 0; i < max_count; i++) {
     var jokePromise = commonutils.getPromise(options);
     promiseList.push(jokePromise);
  }

  return new Promise(function(resolve, reject) {
    Promise.all(promiseList).then(function(promiseResultList) {
      resolve(promiseResultList);
    }, function(error) {
      reject(error);
    });
  });
};

module.exports = {
  getChuckNorrisJokes: getChuckNorrisJokes,
  getRandomTenDevJokes: getRandomTenDevJokes,
  getIcanHazDadJokes: getIcanHazDadJokes,
  getYoMamaJokes: getYoMamaJokes
};
