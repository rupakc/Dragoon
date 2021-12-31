var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');

var getCurrentMatches = function() {
  var baseUrl = "http://cricapi.com/api/matches";
  var queryParams = {
    "apikey": keys.cricApiKey
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getMatchCalender = function() {
  var baseUrl = "http://cricapi.com/api/matchCalendar";
  var queryParams = {
    "apikey": keys.cricApiKey
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getPlayerIdData = function(player_name) {
  var baseUrl = "http://cricapi.com/api/playerFinder";
  var queryParams = {
    "apikey": keys.cricApiKey,
    "name": player_name
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getPlayerHistoryData = function(player_id) {
  var baseUrl = "http://cricapi.com/api/playerStats";
  var queryParams = {
    "apikey": keys.cricApiKey,
    "pid": player_id
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getPlayerDataFromName = function(player_name_full) {
  var playerIdPromise = getPlayerIdData(player_name_full);
  return new Promise(function(resolve, reject) {
    playerIdPromise.then(function(result) {
      var resultDataId = result["data"][0]["pid"];
      var playerHistoryPromise = getPlayerHistoryData(resultDataId);
      playerHistoryPromise.then(function(result) {
        resolve(result);
      }, function(error) {
          reject(error);
      });
    }, function(error) {
      reject(error);
    });
  });
}

module.exports = {
  getCurrentMatches: getCurrentMatches,
  getMatchCalender: getMatchCalender,
  getPlayerIdData: getPlayerIdData,
  getPlayerHistoryData: getPlayerHistoryData,
  getPlayerDataFromName: getPlayerDataFromName
};
