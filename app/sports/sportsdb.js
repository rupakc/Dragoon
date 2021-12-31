var keys = require('../../config/keys');
var commonutils = require('../utils/commonutils');

var getTeamInfoData = function(team_name) {
  var baseUrl = "https://www.thesportsdb.com/api/v1/json/1/searchteams.php";
  var queryParams = {
    "t": team_name
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getPlayerInfoData = function(player_name) {
  var baseUrl = "https://www.thesportsdb.com/api/v1/json/1/searchplayers.php";
  var queryParams = {
    "p": player_name
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getAllLeagueData = function(country_name,sport_name) {
  var baseUrl = "https://www.thesportsdb.com/api/v1/json/1/search_all_leagues.php";
  var queryParams = {
    "c": country_name,
    "s": sport_name
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getEventCalendar = function(date_php_format,sport_name) {
  var baseUrl = "https://www.thesportsdb.com/api/v1/json/1/eventsday.php";
  var queryParams = {
    "d": date_php_format,
    "s": sport_name
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getAllTeamInfo = function(sport_name,country_name) {
  var baseUrl = "https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php";
  var queryParams = {
    "s": sport_name,
    "c": country_name
  };
  var options = {
    url: baseUrl,
    qs: queryParams
  };
  return commonutils.getPromise(options);
};

var getF1SeasonInfo = function(season_year) {
  var baseUrl = "http://ergast.com/api/f1/";
  var finalUrl = baseUrl + season_year + ".json";
  var options = {
    url: finalUrl
  };
  return commonutils.getPromise(options);
}

var getUFCInfoData = function(type="fighters") {
  var baseUrl = "http://ufc-data-api.ufc.com/api/v1/us/fighters";
  if (type == "fighters") {
    baseUrl = "http://ufc-data-api.ufc.com/api/v1/us/fighters";
  } else if (type == "news") {
    baseUrl = "http://ufc-data-api.ufc.com/api/v1/us/news";
  } else if (type == "media") {
    baseUrl = "http://ufc-data-api.ufc.com/api/v1/us/media";
  } else if (type == "events") {
    baseUrl = "http://ufc-data-api.ufc.com/api/v1/us/events";
  }
  var options = {
    url: baseUrl
  };
  return commonutils.getPromise(options);
}

var getFootballCompetitionData = function(season_param) {
  var baseUrl = "http://api.football-data.org/v1/competitions/";
  queryParams = {
    "season": season_param
  };
  var options = {
    url: baseUrl,
    qs: queryParams,
    headers: {"X-Auth-Token": keys.footballOrgApikey}
  };
  return commonutils.getPromise(options);
}

module.exports = {
  getTeamInfoData: getTeamInfoData,
  getPlayerInfoData: getPlayerInfoData,
  getAllLeagueData: getAllLeagueData,
  getAllTeamInfo: getAllTeamInfo,
  getF1SeasonInfo: getF1SeasonInfo,
  getUFCInfoData: getUFCInfoData,
  getFootballCompetitionData: getFootballCompetitionData
};
