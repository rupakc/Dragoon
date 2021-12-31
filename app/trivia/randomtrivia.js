var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');

var jeopardyClues = function(max_count=11) {
  var baseUrl = "http://jservice.io/api/random";
  var queryParams = {
    "count": max_count
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };

  return commonutils.getPromise(options);
}


var openTriviaDB = function(max_count=11) {
  var baseUrl = "https://opentdb.com/api.php";
  var queryParams = {
    "amount": max_count
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

module.exports = {
  jeopardyClues: jeopardyClues,
  openTriviaDB: openTriviaDB
};
