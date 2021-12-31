var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');
var request = require('request');

var darkSkyData = function(latitude,longitude) {
  var baseUrl = "https://api.darksky.net/forecast/";
  var apiKey = keys.darkSkyApiKey;
  var locationString = "/" + latitude + "," + longitude;
  var finalUrl = baseUrl + apiKey + locationString
  var options = {
    url: finalUrl
  };
  return commonutils.getPromise(options);
}

var openUVData = function(latitude,longitude) {
  var options = {
   method: 'GET',
   url: 'https://api.openuv.io/api/v1/uv',
   qs: { lat: String(latitude), lng: String(longitude) },
   headers: { 'content-type': 'application/json',
      'x-access-token': keys.openUVApiKey }
    };

    return commonutils.getPromise(options);
}

var stormGlassOceanData = function(latitude,longitude) {
  var options = {
    url: "https://api.stormglass.io/forecast",
    qs: {lat: String(latitude), lng: String(longitude)},
    headers: {
      'Authentication-Token': keys.stormGlassApiKey
    }
  };

  return commonutils.getPromise(options);
}

var openWeatherMapLocationUVData = function(latitude,longitude) {
  var options = {
    url: "http://api.openweathermap.org/data/2.5/uvi",
    qs: {
      "lat": String(latitude),
      "lon": String(longitude),
      "appid": keys.openWeatherMapKey
    }
  };
  return commonutils.getPromise(options);
}

var openWeatherMapLocationUVDataForecast = function(latitude,longitude) {
  var options = {
    url: "http://api.openweathermap.org/data/2.5/uvi/forecast",
    qs: {
      "lat": String(latitude),
      "lon": String(longitude),
      "appid": keys.openWeatherMapKey
    }
  };
  return commonutils.getPromise(options);
}

var openWeatherMapLocationUVDataHistory = function(latitude,longitude,startTime,endTime) {
  var options = {
    url: "http://api.openweathermap.org/data/2.5/uvi/history",
    qs: {
      "lat": String(latitude),
      "lon": String(longitude),
      "appid": keys.openWeatherMapKey,
      "start": startTime,
      "end": endTime
    }
  };
  return commonutils.getPromise(options);
}

var openWeatherMapPollutionData = function(latitude,longitude,datetime="current",pollutantType="co") {
  var baseUrl = "http://api.openweathermap.org/pollution/v1/";
  var latLongString = "/" + latitude + "," + longitude + "/";
  var datetimeString = String(datetime) + ".json";
  var finalUrl = baseUrl + pollutantType + latLongString + datetimeString;
  var options = {
    url: finalUrl,
    qs: {"appid": keys.openWeatherMapKey}
  };

  return commonutils.getPromise(options);
}

var openWeatherMapForecastData = function(first_query_field,second_query_field,search_type="cityname") {
  var baseUrl = "http://api.openweathermap.org/data/2.5/forecast";
  if (search_type == "geo") {
    var queryParams = {
      "lat": String(first_query_field),
      "lon": String(second_query_field),
      "appid": keys.openWeatherMapKey,
      "units": "metric"
    };
  } else if (search_type == "zip") {
    var query = first_query_field + "," + second_query_field ;
    var queryParams = {
      "zip": query,
      "appid": keys.openWeatherMapKey,
      "units": "metric"
    };
  } else {
    var query = first_query_field + "," + second_query_field ;
    var queryParams = {
      "q": query,
      "appid": keys.openWeatherMapKey,
      "units": "metric"
    };
  }

  var options = {
    url: baseUrl,
    qs: queryParams
  };

  return commonutils.getPromise(options);
}

var openWeatherMapCurrentData = function(first_query_field,second_query_field,search_type="cityname") {
  var baseUrl = "http://api.openweathermap.org/data/2.5/weather";
  if (search_type == "geo") {
    var queryParams = {
      "lat": String(first_query_field),
      "lon": String(second_query_field),
      "appid": keys.openWeatherMapKey,
      "units": "metric"
    };
  } else if (search_type == "zip") {
    var query = first_query_field + "," + second_query_field ;
    var queryParams = {
      "zip": query,
      "appid": keys.openWeatherMapKey,
      "units": "metric"
    };
  } else {
    var query = first_query_field + "," + second_query_field ;
    var queryParams = {
      "q": query,
      "appid": keys.openWeatherMapKey,
      "units": "metric"
    };
  }

  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
}

var weatherbitCurrentData = function(first_query_field,second_query_field,type="ip") {
  var baseUrl = "https://api.weatherbit.io/v2.0/current";
  if (type == "cityname") {
    var queryParams = {
      "city": String(first_query_field),
      "country": String(second_query_field),
      "key": keys.weatherbitApiKey
    };
  } else if (type == "zip") {
      var queryParams = {
        "postal_code": String(first_query_field),
        "country": String(second_query_field),
        "key": keys.weatherbitApiKey
      };
  } else if (type == "geo") {
      var queryParams = {
        "lat": String(first_query_field),
        "lon": String(second_query_field),
        "key": keys.weatherbitApiKey
      };
  }
  else {
    var queryParams = {
      "ip":"auto",
      "key": keys.weatherbitApiKey
    };
  }
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
}

var weatherbitForecastData = function(first_query_field,second_query_field,type="ip",forecast_duration=3) {
  if (forecast_duration == 3) {
    var baseUrl = "https://api.weatherbit.io/v2.0/forecast/3hourly";
  } else {
    var baseUrl = "https://api.weatherbit.io/v2.0/forecast/hourly";
  }

  if (type == "cityname") {
    var queryParams = {
      "city": String(first_query_field),
      "country": String(second_query_field),
      "key": keys.weatherbitApiKey
    };
  } else if (type == "zip") {
      var queryParams = {
        "postal_code": String(first_query_field),
        "country": String(second_query_field),
        "key": keys.weatherbitApiKey
      };
  } else if (type == "geo") {
      var queryParams = {
        "lat": String(first_query_field),
        "lon": String(second_query_field),
        "key": keys.weatherbitApiKey
      };
  }
  else {
    var queryParams = {
      "ip":"auto",
      "key": keys.weatherbitApiKey
    };
  }
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
}


var weatherbitHistoricalData = function(first_query_field,second_query_field,startTime,endTime,type="ip",forecast_duration="daily") {
  if (forecast_duration == "daily") {
    var baseUrl = "https://api.weatherbit.io/v2.0/history/daily";
  } else {
    var baseUrl = "https://api.weatherbit.io/v2.0/history/hourly";
  }
  if (type == "cityname") {
    var queryParams = {
      "city": String(first_query_field),
      "country": String(second_query_field),
      "key": keys.weatherbitApiKey,
      "start_date": startTime,
      "end_date": endTime
    };
  } else if (type == "zip") {
      var queryParams = {
        "postal_code": String(first_query_field),
        "country": String(second_query_field),
        "key": keys.weatherbitApiKey,
        "start_date": startTime,
        "end_date": endTime
      };
  } else if (type == "geo") {
      var queryParams = {
        "lat": String(first_query_field),
        "lon": String(second_query_field),
        "key": keys.weatherbitApiKey,
        "start_date": startTime,
        "end_date": endTime
      };
  }
  else {
    var queryParams = {
      "ip":"auto",
      "key": keys.weatherbitApiKey,
      "start_date": startTime,
      "end_date": endTime
    };
  }
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
}

module.exports = {
  darkSkyData: darkSkyData,
  openUVData: openUVData,
  stormGlassOceanData: stormGlassOceanData,
  openWeatherMapLocationUVData: openWeatherMapLocationUVData,
  openWeatherMapLocationUVDataForecast: openWeatherMapLocationUVDataForecast,
  openWeatherMapLocationUVDataHistory: openWeatherMapLocationUVDataHistory,
  openWeatherMapPollutionData: openWeatherMapPollutionData,
  openWeatherMapForecastData: openWeatherMapForecastData,
  openWeatherMapCurrentData: openWeatherMapCurrentData,
  weatherbitCurrentData: weatherbitCurrentData,
  weatherbitForecastData: weatherbitForecastData,
  weatherbitHistoricalData: weatherbitHistoricalData
};
