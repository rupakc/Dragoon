var weatherSource = require('./weathersource');
var _ = require('lodash');

var openweathermapParser = function(openweathermapResponseJson) {
  var parsedJsonResponseList = [];
  var parsedWeatherJson = {};
  parsedWeatherJson["Country"] = openweathermapResponseJson["sys"]["country"];
  parsedWeatherJson["Name"] = openweathermapResponseJson["name"];
  parsedWeatherJson["Main"] = openweathermapResponseJson["weather"][0]["main"];
  parsedWeatherJson["Temp"] = openweathermapResponseJson["main"]["temp"];
  parsedWeatherJson["Pressure"] = openweathermapResponseJson["main"]["pressure"];
  parsedWeatherJson["Humidity"] = openweathermapResponseJson["main"]["humidity"];
  parsedWeatherJson["TempMin"] = openweathermapResponseJson["main"]["temp_min"];
  parsedWeatherJson["TempMax"] = openweathermapResponseJson["main"]["temp_max"];
  parsedWeatherJson["Visibility"] = openweathermapResponseJson["visibility"];
  parsedWeatherJson["WindSpeed"] = openweathermapResponseJson["wind"]["speed"];
  parsedWeatherJson["WindDegree"] = openweathermapResponseJson["wind"]["deg"];
  parsedWeatherJson["Clouds"] = openweathermapResponseJson["clouds"]["all"];
  parsedJsonResponseList.push(parsedWeatherJson);
  return parsedJsonResponseList;
}

var weatherbitParser = function(weatherbitResponseJson) {
  var dataJson = weatherbitResponseJson["data"][0];
  delete dataJson["weather"];
  var parsedResponseList = [];
  parsedResponseList.push(dataJson);
  return parsedResponseList;
}

var darkskyParser = function(darkskyResponseJson) {
  if (darkskyResponseJson == null || darkskyResponseJson == undefined || darkskyResponseJson.length == 0) {
    return [];
  }
  var currentJson = darkskyResponseJson["currently"];
  var hourlyJsonList = darkskyResponseJson["hourly"]["data"];
  hourlyJsonList.push(currentJson);
  return hourlyJsonList;
}

var openUVDataParser = function(openUVResponseJSON) {
  if (openUVResponseJSON == null || openUVResponseJSON == undefined || openUVResponseJSON.length == 0) {
    return [];
  }
  var parsedResponseJsonList = [];
  var resultJson = openUVResponseJSON["result"];
  delete resultJson["safe_exposure_time"];
  var sunJson = resultJson["sun_info"]["sun_times"];
  resultJson["solarNoon"] = sunJson["solarNoon"];
  resultJson["nadir"] = sunJson["nadir"];
  resultJson["sunrise"] = sunJson["sunrise"];
  resultJson["sunset"] = sunJson["sunset"];
  resultJson["azimuth"] = resultJson["sun_info"]["sun_position"]["azimuth"];
  resultJson["altitude"] = resultJson["sun_info"]["sun_position"]["altitude"];
  delete resultJson["sun_info"];
  parsedResponseJsonList.push(resultJson);
  return parsedResponseJsonList;
}

var getWeatherPromiseList = function(latitude,longitude,searchType,weatherChannelList) {
  var weatherPromiseList = [];
  for (var i = 0; i < weatherChannelList.length; i++) {
    if (weatherChannelList[i] == "darksky") {
      if (searchType == "geo") {
        weatherPromiseList.push(weatherSource.darkSkyData(latitude,longitude));
      } else {
        weatherPromiseList.push([]);
      }
    } else if (weatherChannelList[i] == "openuvdata") {
      if (searchType == "geo") {
        weatherPromiseList.push(weatherSource.openUVData(latitude,longitude));
      } else {
        weatherPromiseList.push([]);
      }
    } else if (weatherChannelList[i] == "stormglass") {
      if (searchType == "geo") {
        weatherPromiseList.push(weatherSource.stormGlassOceanData(latitude,longitude));
      } else {
        weatherPromiseList.push([]);
      }
    } else if (weatherChannelList[i] == "weatherbit") {
      weatherPromiseList.push(weatherSource.weatherbitCurrentData(latitude,longitude,type=searchType));
    } else if (weatherChannelList[i] == "openweathermap") {
      weatherPromiseList.push(weatherSource.openWeatherMapCurrentData(latitude,longitude,type=searchType));
    }
  }
  return weatherPromiseList;
}

var getAggregatedParsedResponse = function(latitude,longitude,type,weatherChannelList) {
  var weatherPromiseList = getWeatherPromiseList(latitude,longitude,type,weatherChannelList);
  var parsedPromiseList = [];
  return new Promise(function(resolve, reject) {
    Promise.all(weatherPromiseList).then(function(resultList) {
      for (var i = 0; i < weatherChannelList.length; i++) {
        if (weatherChannelList[i] == "openuvdata") {
          parsedPromiseList.push(openUVDataParser(resultList[i]));
        } else if (weatherChannelList[i] == "darksky") {
          parsedPromiseList.push(darkskyParser(resultList[i]));
        } else if (weatherChannelList[i] == "weatherbit") {
          parsedPromiseList.push(weatherbitParser(resultList[i]));
        } else if (weatherChannelList[i] == "openweathermap") {
          parsedPromiseList.push(openweathermapParser(resultList[i]));
        } else {
          parsedPromiseList.push(resultList[i]);
        }
      }
        resolve(parsedPromiseList);
    }, function(error) {
        reject(error);
    });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}
