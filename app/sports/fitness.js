var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');

var getJCDecauxBikeInfo = function(contractName) {
  var baseUrl = "https://api.jcdecaux.com/vls/v1/stations";
  var queryParams = {
    contract: contractName,
    apiKey: keys.jcdecauxApiKey
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  }
  return commonutils.getPromise(options);
}

module.exports = {
  getJCDecauxBikeInfo: getJCDecauxBikeInfo
}
