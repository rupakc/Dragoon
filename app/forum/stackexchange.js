var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');

var stackExchangeData = function(search_query,site="stackoverflow") {
  var baseUrl = "https://api.stackexchange.com/2.2/questions";
  var queryParams = {
    "tagged": search_query,
    "pagesize": "100",
    "order": "desc",
    "sort": "activity",
    "site": "stackoverflow"
  };
  var options = {
    url: baseUrl,
    qs: queryParams,
    gzip: true
  };

  return commonutils.getPromise(options);
};

module.exports = {
  stackExchangeData: stackExchangeData
}
