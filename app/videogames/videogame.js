var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');
var request = require('request');
const igdb = require('igdb-api-node').default;
var parseString = require('xml2js').parseString;

const client = igdb(keys.igdbApiKey);

var searchIGDBPlatform = function(search_query) {
  return client.platforms({
    search: search_query,
    fields: "*"
  });
};

var searchIGDBGames = function(search_query) {
  return client.games({
      fields: "*",
      order: 'release_dates.date:desc',
      search: search_query
  });
};

var searchIGDBCompanies = function(search_query) {
  return client.companies({
      fields:"*" ,
      order: 'name:desc',
      search: search_query
  });
};

var getGiantBombSearchResult = function(search_query) {
  var baseUrl = "https://www.giantbomb.com/api/search/";
  var queryParams = {
    "query": search_query,
    "api_key": keys.giantbombApiKey
  };
  var options = {
    url: baseUrl,
    qs: queryParams,
    headers: {"User-Agent": "test-node-app"}
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
  searchIGDBPlatform: searchIGDBPlatform,
  searchIGDBGames: searchIGDBGames,
  searchIGDBCompanies: searchIGDBCompanies,
  getGiantBombSearchResult: getGiantBombSearchResult

};
