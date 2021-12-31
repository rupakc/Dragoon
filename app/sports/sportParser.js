var sportsSource = require('./sportsdb');
var fitnessSource = require('./fitness');
var cricketSource = require('./cricket');

var f1DataParser = function(f1ResponseJson) {
  raceTableJsonList = f1ResponseJson["MRData"]["RaceTable"]["Races"];
  for (var i = 0; i < raceTableJsonList.length; i++) {
    raceTableJsonList[i]["CircuitName"] = raceTableJsonList[i]["Circuit"]["circuitName"];
    raceTableJsonList[i]["Locality"] = raceTableJsonList[i]["Circuit"]["Location"]["locality"];
    raceTableJsonList[i]["Country"] = raceTableJsonList[i]["Circuit"]["Location"]["country"];
    delete raceTableJsonList[i]["Circuit"];
  }
  return raceTableJsonList;
}

var jcdecauxParser = function(decauxReponseJson) {
  for (var i = 0; i < decauxReponseJson.length; i++) {
    decauxReponseJson[i]["latitude"] = decauxReponseJson[i]["position"]["lat"];
    decauxReponseJson[i]["longitude"] = decauxReponseJson[i]["position"]["lng"];
    delete decauxReponseJson[i]["position"];
  }
  return decauxReponseJson;
}

var ufcFighterParser = function(figherResponseJsonList) {
  if (figherResponseJsonList == null || figherResponseJsonList == undefined || figherResponseJsonList.length == 0) {
    return [];
  }
  for (var i = 0; i < figherResponseJsonList.length; i++) {
    delete figherResponseJsonList[i].thumbnail;
    delete figherResponseJsonList[i].belt_thumbnail;
  }
  return figherResponseJsonList;
}

var ufcNewsParser = function(newsResponseJsonList) {
  if (newsResponseJsonList == null || newsResponseJsonList == undefined || newsResponseJsonList.length == 0) {
    return [];
  }
  var fieldsToDelete = ["id","external_url_text","article_media_id", "article_fighter_id","featured_news_category",
                       "thumbnail","external_url","keyword_ids","published_start_date"];

  for (var i = 0; i < newsResponseJsonList.length; i++) {
    for (var j = 0; j < fieldsToDelete.length; j++) {
      delete newsResponseJsonList[i][fieldsToDelete[j]];
    }
  }
  return newsResponseJsonList;
}

var footballDataParser = function(footballResponseJsonList) {
  if (footballResponseJsonList == null || footballResponseJsonList == undefined || footballResponseJsonList.length == 0) {
    return [];
  }
  for (var i = 0; i < footballResponseJsonList.length; i++) {
    delete footballResponseJsonList[i]._links;
  }
  return footballResponseJsonList;
}

var cricketMatchCalendarParser = function(cricketResponseJson) {
  var matchList = cricketResponseJson["data"];
  if (matchList == null || matchList == undefined || matchList.length == 0) {
    return [];
  }
  for (var i = 0; i < matchList.length; i++) {
    delete matchList[i]["unique_id"];
  }
  return matchList;
}

var cricketCurrentMatchParser = function(currentMatchResponseJson) {
  var matchesList = currentMatchResponseJson["matches"];
  if (matchesList == null || matchesList == undefined) {
    return [];
  }
  return matchesList;
}

var sportsDBTeamParser = function(sportsDBTeamResponseJson) {
  var teamJsonList = sportsDBTeamResponseJson["teams"];
  if (teamJsonList == null || teamJsonList == undefined || teamJsonList.length == 0) {
    return [];
  }
  var parsedTeamJsonList = [];
  for (var i = 0; i < teamJsonList.length; i++) {
    parsedTeamJsonList.push({"Team": teamJsonList[i]["strTeam"],
                             "FormedYear": teamJsonList[i]["intFormedYear"],
                             "Sport": teamJsonList[i]["strSport"],
                             "League": teamJsonList[i]["strLeague"],
                             "Manager": teamJsonList[i]["strManager"],
                             "Stadium": teamJsonList[i]["strStadium"],
                             "StadiumDescription": teamJsonList[i]["strStadiumDescription"],
                             "StadiumLocation": teamJsonList[i]["strStadiumLocation"],
                             "StadiumCapacity": teamJsonList[i]["strStadiumCapacity"],
                             "Website": teamJsonList[i]["strWebsite"],
                             "Description": teamJsonList[i]["strDescriptionEN"]});
  }
  return parsedTeamJsonList;
}

var sportsDBPlayerParser = function(sportsDBPlayerResponseJson) {
  var playerJsonList = sportsDBPlayerResponseJson["player"];
  var parsedPlayerJsonList = [];
  if (playerJsonList == null || playerJsonList == undefined || playerJsonList.length == 0) {
    return parsedPlayerJsonList;
  }
  for (var i = 0; i < playerJsonList.length; i++) {
    parsedPlayerJsonList.push({"Nationality": playerJsonList[i]["strNationality"],
                               "PlayerName": playerJsonList[i]["strPlayer"],
                               "Team": playerJsonList[i]["strTeam"],
                               "Sport": playerJsonList[i]["strSport"],
                               "DOB": playerJsonList[i]["dateBorn"],
                               "BirthLocation": playerJsonList[i]["strBirthLocation"],
                               "Description": playerJsonList[i]["strDescriptionEN"],
                               "Gender": playerJsonList[i]["strGender"],
                               "Position": playerJsonList[i]["strPosition"],
                               "Height": playerJsonList[i]["strHeight"],
                               "Wage": playerJsonList[i]["strWage"],
                               "Signing": playerJsonList[i]["strSigning"]});
  }
  return parsedPlayerJsonList;
}

var sportsDBLeagueParser = function(sportsDBLeagueResponseJson) {
  var countryLeagueList = sportsDBLeagueResponseJson["countrys"];
  if (countryLeagueList == null || countryLeagueList == undefined || countryLeagueList.length == 0) {
    return [];
  }
  var parsedLeagueJsonList = [];
  for (var i = 0; i < countryLeagueList.length; i++) {
    parsedLeagueJsonList.push({"Sport": countryLeagueList[i]["strSport"],
                               "League": countryLeagueList[i]["strLeague"],
                               "InceptionYear": countryLeagueList[i]["intFormedYear"],
                               "FirstEventDate": countryLeagueList[i]["dateFirstEvent"],
                               "Country": countryLeagueList[i]["strCountry"],
                               "Description": countryLeagueList[i]["strDescriptionEN"]});
  }
  return parsedLeagueJsonList;
}

var cricketPlayerParser = function(playerResponseJson) {
  delete playerResponseJson.data;
  delete playerResponseJson.v;
  delete playerResponseJson.ttl;
  delete playerResponseJson.creditsLeft;
  delete playerResponseJson.provider;
  return [playerResponseJson];
}

var getSportPromiseList = function(queryTerm,auxiliaryInfo,sportChannelList,type) {
  var sportPromiseList = [];
  for (var i = 0; i < sportChannelList.length; i++) {
    if (sportChannelList[i] == "f1") {
      sportPromiseList.push(sportsSource.getF1SeasonInfo(queryTerm));
    } else if (sportChannelList[i] == "bikerental") {
      sportPromiseList.push(fitnessSource.getJCDecauxBikeInfo(queryTerm));
    } else if (sportChannelList[i] == "currentmatchcricket") {
      sportPromiseList.push(cricketSource.getCurrentMatches());
    } else if (sportChannelList[i] == "cricketmatchcalendar") {
      sportPromiseList.push(cricketSource.getMatchCalender());
    } else if (sportChannelList[i] == "cricketplayerinfo") {
      sportPromiseList.push(cricketSource.getPlayerDataFromName(queryTerm));
    } else if (sportChannelList[i] == "sportsdb" && type == "team") {
      sportPromiseList.push(sportsSource.getTeamInfoData(queryTerm));
    } else if (sportChannelList[i] == "sportsdb" && type == "player") {
      sportPromiseList.push(sportsSource.getPlayerInfoData(queryTerm));
    } else if (sportChannelList[i] == "sportsdb" && type == "league") {
      sportPromiseList.push(sportsSource.getAllLeagueData(queryTerm,auxiliaryInfo));
    } else if (sportChannelList[i] == "football") {
      sportPromiseList.push(sportsSource.getFootballCompetitionData(queryTerm));
    } else if (sportChannelList[i] == "ufc") {
      sportPromiseList.push(sportsSource.getUFCInfoData(type))
    }
  }
  return sportPromiseList;
}

var getAggregatedParsedResponse = function(queryTerm,auxiliaryInfo,sportChannelList,type) {
  var sportPromiseList = getSportPromiseList(queryTerm,auxiliaryInfo,sportChannelList,type);
  var parsedResultJsonList = [];
  return new Promise(function(resolve, reject) {
    Promise.all(sportPromiseList).then(function(resultList) {
      for (var i = 0; i < sportChannelList.length; i++) {
        if (sportChannelList[i] == "f1") {
          parsedResultJsonList.push(f1DataParser(resultList[i]));
        } else if (sportChannelList[i] == "bikerental") {
          parsedResultJsonList.push(jcdecauxParser(resultList[i]));
        } else if (sportChannelList[i] == "currentmatchcricket") {
          parsedResultJsonList.push(cricketCurrentMatchParser(resultList[i]));
        } else if (sportChannelList[i] == "cricketmatchcalendar") {
          parsedResultJsonList.push(cricketMatchCalendarParser(resultList[i]));
        } else if (sportChannelList[i] == "cricketplayerinfo") {
          parsedResultJsonList.push(cricketPlayerParser(resultList[i]));
        } else if (sportChannelList[i] == "sportsdb" && type == "team") {
          parsedResultJsonList.push(sportsDBTeamParser(resultList[i]));
        } else if (sportChannelList[i] == "sportsdb" && type == "player") {
          parsedResultJsonList.push(sportsDBPlayerParser(resultList[i]));
        } else if (sportChannelList[i] == "sportsdb" && type == "league") {
          parsedResultJsonList.push(sportsDBLeagueParser(resultList[i]));
        } else if (sportChannelList[i] == "ufc" && type == "fighter") {
          parsedResultJsonList.push(ufcFighterParser(resultList[i]));
        } else if (sportChannelList[i] == "ufc" && type == "news") {
          parsedResultJsonList.push(ufcNewsParser(resultList[i]));
        } else if (sportChannelList[i] == "football") {
          parsedResultJsonList.push(footballDataParser(resultList[i]));
        } else {
          parsedResultJsonList.push(resultList[i]);
        }
      }
      resolve(parsedResultJsonList);
    }, function(error) {
        reject(error);
    });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}
