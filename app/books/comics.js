var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');
var crypto = require('crypto');
var request = require('request');
var parseString = require('xml2js').parseString;

var _createHash = function(ts) {
  var content = ts + keys.marvelPrivateApiKey + keys.marvelPublicApiKey;
  var hash = crypto.createHash('md5').update(content).digest('hex');
  return hash;
};

var _timestamp = function() {
  return parseInt(Date.now() / 1000, 10);
};

var marvelInfoData = function(search_query,type="character") {
  var ts = _timestamp();
  var hash = _createHash(ts);

  if (type == "comic") {
    var baseUrl = "https://gateway.marvel.com/v1/public/comics";
    var queryParams = {
      "titleStartsWith": search_query,
      "apikey": keys.marvelPublicApiKey,
      "ts": ts,
      "hash": hash
    };
  } else if (type == "creator") {
    var baseUrl = "https://gateway.marvel.com/v1/public/creators";
    var queryParams = {
      "nameStartsWith": search_query,
      "apikey": keys.marvelPublicApiKey,
      "ts": ts,
      "hash": hash
    };
  } else if (type == "event") {
    var baseUrl = "https://gateway.marvel.com/v1/public/events";
    var queryParams = {
      "nameStartsWith": search_query,
      "apikey": keys.marvelPublicApiKey,
      "ts": ts,
      "hash": hash
    };
  } else if (type == "series") {
    var baseUrl = "https://gateway.marvel.com/v1/public/series";
    var queryParams = {
      "titleStartsWith": search_query,
      "apikey": keys.marvelPublicApiKey,
      "ts": ts,
      "hash": hash
    };
  } else {
    var baseUrl = "https://gateway.marvel.com/v1/public/characters";
    var queryParams = {
      "nameStartsWith": search_query,
      "apikey": keys.marvelPublicApiKey,
      "ts": ts,
      "hash": hash
    };
  }

  var options = {
    url: baseUrl,
    qs: queryParams
  };

  return commonutils.getPromise(options);
};

var comicVineResponseData = function(search_query) {
  var baseUrl = "http://api.comicvine.com/search";
  var queryParams = {
    "api_key": keys.comicVineApiKey,
    "query": search_query
  };

  var options = {
    url: baseUrl,
    qs: queryParams,
    headers: {"Accept": "application/json", "User-Agent": "test-node-app"}
  };

  return new Promise(function(resolve,reject) {
      request(options,function(error,response,body) {
          if (error) {
            reject(error);
          } else {
              parseString(body, function (err, result) {
              if (err) {
                  reject(err);
              } else {
                  resolve(result);
              }
            });
          }
      });
  });
};

module.exports = {
  marvelInfoData: marvelInfoData,
  comicVineResponseData: comicVineResponseData
};
