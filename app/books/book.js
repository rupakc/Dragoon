var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');
var request = require('request');
var parseString = require('xml2js').parseString;

var goodReadsSearch = function(search_query) {
  var queryParams = {
    "q": search_query,
    "key": keys.goodReadsApiKey
  };
  var options = {
    url: "https://www.goodreads.com/search",
    qs: queryParams
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
  goodReadsSearch: goodReadsSearch
};
