var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');

var getLatestAirQuality = function(cityNameOrCountryCode,type="city") {
  var baseUrl = "https://api.openaq.org/v1/latest";

  if (type == "country") {
    var queryParams = {
      "country": cityNameOrCountryCode
    };
  } else {
    var queryParams = {
      "city": cityNameOrCountryCode
    };
  }
  var options = {
    url: baseUrl,
    qs: queryParams
  };

  return commonutils.getPromise(options);
};

var getNearestAirVisualQuality = function() {
  var baseUrl = "http://api.airvisual.com/v2/nearest_city";
  var queryParams = {
    "key": keys.airVisualApiKey
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };

  return commonutils.getPromise(options);
};

var getNearestAirVisualQualityByGeo = function(latitude,longitude) {
  var baseUrl = "http://api.airvisual.com/v2/nearest_city";
  var queryParams = {
    "key": keys.airVisualApiKey,
    "lat": String(latitude),
    "lon": String(longitude)
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };

  return commonutils.getPromise(options);
};

var getVisualAirQualityByCityName = function(city,state,country) {
    var baseUrl = "http://api.airvisual.com/v2/city";
    var queryParams = {
      "city": city,
      "state": state,
      "country": country,
      "key": keys.airVisualApiKey
    };
    var options = {
      url: baseUrl,
      qs: queryParams
    };

    return commonutils.getPromise(options);
}

module.exports = {
  getLatestAirQuality: getLatestAirQuality,
  getNearestAirVisualQuality: getNearestAirVisualQuality,
  getNearestAirVisualQualityByGeo: getNearestAirVisualQualityByGeo,
  getVisualAirQualityByCityName: getVisualAirQualityByCityName
};
