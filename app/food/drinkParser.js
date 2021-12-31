var drinkSource = require('./drink');

var cocktailDbParser = function(cocktailDbResponseJson) {
  var drinkList = cocktailDbResponseJson["drinks"];
  if (drinkList == null || drinkList == undefined) {
    return [];
  }
  var parsedDrinkList = [];
  for (var i = 0; i < drinkList.length; i++) {
    parsedDrinkList.push({"Id": drinkList[i]["idDrink"], "Name": drinkList[i]["strDrink"],
                        "Category": drinkList[i]["strCategory"], "Alcoholic": drinkList[i]["strAlcoholic"],
                        "Glass": drinkList[i]["strGlass"], "Instructions": drinkList[i]["strInstructions"]
                      });
  }
  return parsedDrinkList;
}

var beerPunkParser = function(beerPunkResonseJsonList) {
  if (beerPunkResonseJsonList == null || beerPunkResonseJsonList == undefined) {
    return [];
  }
  var parsedPunkBeerList = [];
  for (var i = 0; i < beerPunkResonseJsonList.length; i++) {
    parsedPunkBeerList.push({"Name": beerPunkResonseJsonList[i]["name"],
                            "Tagline": beerPunkResonseJsonList[i]["tagline"],
                            "FirstBrewed": beerPunkResonseJsonList[i]["first_brewed"],
                            "Description": beerPunkResonseJsonList[i]["description"],
                            "FoodPairing": beerPunkResonseJsonList[i]["food_pairing"],
                            "BrewersTips": beerPunkResonseJsonList[i]["brewers_tips"]});
  }

  return parsedPunkBeerList;
}


var getDrinkPromiseList = function(search_query,drinkChannels) {
  var drinkPromiseList = [];
  for(var i = 0; i < drinkChannels.length; i++) {
    if (drinkChannels[i] == "cocktaildb") {
      drinkPromiseList.push(drinkSource.cocktailDb(search_query));
    } else if (drinkChannels[i] == "beerpunk") {
      drinkPromiseList.push(drinkSource.beer(search_query));
    }
  }
  return drinkPromiseList;
}

var getAggregatedParsedResponse = function(search_query,drinkChannels) {
  var drinkPromiseList = getDrinkPromiseList(search_query,drinkChannels);
  var parsedDrinkResponseList = [];
  return new Promise(function(resolve,reject) {
      Promise.all(drinkPromiseList).then(function(responseJsonList) {
        for(var i = 0; i < drinkChannels.length; i++) {
          if (drinkChannels[i] == "cocktaildb") {
            parsedDrinkResponseList.push(cocktailDbParser(responseJsonList[i]));
          } else if (drinkChannels[i] == "beerpunk") {
            parsedDrinkResponseList.push(beerPunkParser(responseJsonList[i]));
          } else {
            parsedDrinkResponseList.push(responseJsonList[i]);
          }
        }
        resolve(parsedDrinkResponseList);
      }, function(error) {
          reject(error);
      });
  });
}

module.exports = {
  getAggregatedParsedResponse: getAggregatedParsedResponse
}

// var drink = getAggregatedParsedResponse('miller',['cocktaildb','beerpunk']);
// drink.then(function(result) {
//   console.log(JSON.stringify(result,null,4));
// }, function(error) {
//   console.log(error);
// });
