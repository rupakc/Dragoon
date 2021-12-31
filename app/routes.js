var drink = require('./food/drink');
var food = require('./food/food');
var movieSource = require('./movie/movieParser');
var movieExecutor = require('./movie/movieExecutor');
var jokeParser = require('./jokes/jokeParser');
var jokeExecutor = require('./jokes/jokeExecutor');
var triviaExecutor = require('./trivia/triviaExecutor');
var triviaParser = require('./trivia/triviaParser');
var drinkParser = require('./food/drinkParser');
var videogameParser = require('./videogames/videogameParser');
var videogameExecutor = require('./videogames/videogameExecutor');
var bookParser = require('./books/bookParser');
var bookExecutor = require('./books/bookExecutor');
var comicParser = require('./books/comicParser');
var foodParser = require('./food/foodParser');
var foodExecutor = require('./food/foodExecutor')
var weatherParser = require('./weather/weatherParser');
var forumParser = require('./forum/forumParser');
var forumExecutor = require('./forum/forumExecutor');
var sportsParser = require('./sports/sportParser');
var constants = require('../config/constants');
var _ = require('lodash');

module.exports = function (app) {

      app.get('/drinkdata', function(request,response) {
          var beer_query = request.query['beer'];
          var food_query = request.query['food'];
          var drinkChannels = request.query['drinkChannels'];
          var foodOperationList = request.query["foodOperationList"];

          if (foodOperationList == undefined || foodOperationList.constructor !== Array) {
              foodOperationList = [foodOperationList];
          }
          if (_.includes(foodOperationList,"cuisineprediction")) {
            drinkChannels = constants.supportedCuisineChannels;
          }
          if (_.includes(foodOperationList,"ratingprediction")) {
            drinkChannels = constants.supportedFoodRatingChannels;
          }
          if (_.includes(foodOperationList,"calorieprediction")) {
            drinkChannels = constants.supportedCalorieRatingChannels;
          }
          if (beer_query != "none") {
            var drinkPromise = drinkParser.getAggregatedParsedResponse(beer_query,drinkChannels);
          }
          if (food_query != "none") {
            var foodPromise = foodExecutor.getAggregatedParsedOperationResponse(food_query,drinkChannels,foodOperationList);
          }

          Promise.all([drinkPromise,foodPromise]).then(function(resultList) {
            var parsedResultList = _.compact(resultList);
            var result = _.compact(_.flattenDepth(parsedResultList,1));
            responseJson = {"channels": drinkChannels, "resultList": result};
            response.json(responseJson);
          },function(error) {
            console.log(error);
          });
      });

      app.get('/moviedata', function(request,response) {
        var search_query = request.query['q'];
        var movieChannels = request.query['movieChannels'];
        var movieOperation = request.query['movieOperation'];
        if(movieChannels.constructor !== Array) {
          movieChannels = [movieChannels];
        }
        if (movieOperation != undefined && movieOperation == "castratingprediction") {
          movieChannels = constants.supportedMovieRatingTextChannels;
        }
        var moviePromise = movieExecutor.getMoviePredictionPromise(search_query,movieChannels,movieOperation);
        moviePromise.then(function(result) {
          responseJson = {"channels": movieChannels, "resultList": result};
          response.json(responseJson);
        }, function(error) {
          console.log(error);
        });
      });

      app.get('/weatherdata', function(request,response) {
        var type = request.query['type'];
        var latitude = request.query['lat'];
        var longitude = request.query['lon'];
        if (type == "geo") {
          var latitude = parseFloat(latitude);
          var longitude = parseFloat(longitude);
        }
        var weatherChannels = request.query['weatherChannels'];
        if(weatherChannels.constructor !== Array) {
          weatherChannels = [weatherChannels];
        }
        var weatherPromise = weatherParser.getAggregatedParsedResponse(latitude,longitude,type,weatherChannels);
        weatherPromise.then(function(result) {
          responseJson = {"channels": weatherChannels, "resultList": result};
          response.json(responseJson);
        }, function(error) {
          console.log(error);
        });
      });

      app.get('/jokedata', function(request,response) {
        var search_query = request.query['q'];
        var jokeChannels = request.query['jokeChannels'];
        var operationList = request.query['operationList'];
        var triviaChannels = [];
        if (jokeChannels.constructor !== Array) {
            jokeChannels = [jokeChannels];
        }
        if (operationList == undefined || operationList.constructor !== Array) {
          operationList = [operationList];
        }

        triviaChannels =  _.intersection(jokeChannels, ["opentrivia","jeopardy"]);
        jokeChannels = _.remove(jokeChannels,function(channelName) {
                        if (channelName == "opentrivia" || channelName == "jeopardy") {
                              return false;
                         } else {
                           return true;
                         }
                       });

        if (_.includes(operationList,"questiontypepredictor")) {
            triviaChannels = constants.supportedTriviaChannels;
        }
        if (_.includes(operationList,"jokegenerator")) {
            jokeChannels = constants.supportedJokeGenerationChannels;
        }
        var jokePromise = jokeExecutor.getAggregatedParsedOperationResponse(search_query,jokeChannels,operationList);
        var triviaPromise = triviaExecutor.getAggregatedParsedOperationResponse(triviaChannels,operationList);

        console.log(jokeChannels);
        console.log(triviaChannels);

        Promise.all([jokePromise,triviaPromise]).then(function(resultList) {
            var parsedResultList = _.compact(resultList);
            var result = _.compact(_.flattenDepth(parsedResultList,1));
            _.forEach(triviaChannels,function(triviaChannel) {
                jokeChannels.push(triviaChannel);
            });
            console.log(jokeChannels);
            responseJson = {"channels": jokeChannels, "resultList": result};
            response.json(responseJson);
          }, function(error) {
              console.log(error);
          });
      });

      app.get('/videogamedata', function(request,response) {
        var search_query = request.query['q'];
        var videoGameChannels = request.query['videoGameChannels'];
        var gameOperationList = request.query['gameOperationList'];
        if (videoGameChannels.constructor !== Array) {
            videoGameChannels = [videoGameChannels];
        }
        if (gameOperationList == undefined || gameOperationList.constructor !== Array) {
            gameOperationList = [gameOperationList];
        }
        if (_.includes(gameOperationList,"gamepopularity") && _.includes(videoGameChannels,"giantbomb")) {
          videoGameChannels = constants.supportGameRatingChannels;
        }
        var videoGamePromise = videogameExecutor.getAggregatedParsedOperationResponse(search_query,videoGameChannels,gameOperationList);
        videoGamePromise.then(function(result) {
          responseJson = {"channels": videoGameChannels, "resultList": result};
          response.json(responseJson);
        }, function(error) {
          console.log(error);
        });
      });

      app.get('/forumdata', function(request,response) {
        var search_query = request.query['q'];
        var forumChannels = request.query['forumChannels'];
        var forumOperations = request.query['operationList'];
        if (forumChannels.constructor !== Array) {
            forumChannels = [forumChannels];
        }
        if (forumOperations == undefined || forumOperations.constructor !== Array) {
          forumOperations = [forumOperations];
        }

        var forumPromise = forumExecutor.getAggregatedParsedOperationResponse(search_query,forumChannels,forumOperations);
        forumPromise.then(function(result) {
          responseJson = {"channels": forumChannels, "resultList": result};
          response.json(responseJson);
        }, function(error) {
          console.log(error);
        });
      });

      app.get('/sportsdata', function(request,response) {
        var search_query = request.query['sportName'];
        var sportChannels = request.query['sportChannels'];
        var type = request.query["searchType"];
        var auxiliaryInfo = request.query["aux"];
        if (sportChannels.constructor !== Array) {
            sportChannels = [sportChannels];
        }
        var sportPromise = sportsParser.getAggregatedParsedResponse(search_query,auxiliaryInfo,sportChannels,type);
        sportPromise.then(function(result) {
          responseJson = {"channels": sportChannels, "resultList": result};
          response.json(responseJson);
        }, function(error) {
          console.log(error);
        });
      });

      app.get('/bookcomicdata', function(request,response) {
        var search_query = request.query['q'];
        var bookComicChannels = request.query['bookComicChannels'];
        var bookOperationList = request.query['bookOperations'];
        if (bookOperationList == undefined || bookOperationList.constructor !== Array) {
          bookOperationList = [bookOperationList];
        }
        if (bookComicChannels.constructor !== Array) {
            bookComicChannels = [bookComicChannels];
        }
        if (_.includes(bookOperationList,"ratingprediction")) {
          bookComicChannels = constants.supportedBookRatingChannels;
        }
        var bookPromise = bookExecutor.getAggregatedParsedOperationResponse(search_query,bookComicChannels,bookOperationList);

        Promise.all([bookPromise]).then(function(resultList) {
          var parsedResultList = _.compact(resultList);
          var result = _.compact(_.flattenDepth(parsedResultList,1));
          bookComicChannels.length = result.length
          responseJson = {"channels": bookComicChannels, "resultList": result};
          response.json(responseJson);
        }, function(error) {
          console.log(error);
        });
      });

      app.get('/comicdata', function(request,response) {
        var search_query = request.query['q'];
        var comicChannels = request.query['comicChannels'];
        if (comicChannels.constructor !== Array) {
            comicChannels = [comicChannels];
        }
        var comicPromise = comicParser.getAggregatedParsedResponse(search_query,comicChannels);
        comicPromise.then(function(result) {
          var responseJson = {"channels": comicChannels, "resultList": result};
          response.json(responseJson);
        }, function(error) {
            console.log(error);
        });
      });

      app.get('/moviesources', function(request,response) {
        var movieSources = constants.movieSources;
        var movieOperations = constants.movieOperations;
        var responseJson = {"sources": movieSources,"operations": movieOperations};
        response.json(responseJson);
      });

      app.get('/sportsources', function(request,response) {
        var sportSources = constants.sportSources;
        var sportOperations = constants.sportOperations;
        var responseJson = {"sources": sportSources,"operations": sportOperations};
        response.json(responseJson);
      });

      app.get('/weathersources',function(request,response) {
        var weatherSources = constants.weatherSources;
        var weatherOperations = constants.weatherOperations;
        var responseJson = {"sources": weatherSources, "operations": weatherOperations};
        response.json(responseJson);
      });

      app.get('/booksources',function(request,response) {
        var bookSources = constants.bookSources;
        var bookOperations = constants.bookOperations;
        var responseJson = {"sources": bookSources, "operations": bookOperations};
        response.json(responseJson);
      });

      app.get('/comicsources',function(request,response) {
        var comicSources = constants.comicSources;
        var responseJson = {"sources": comicSources};
        response.json(responseJson);
      });

      app.get('/entertainmentsources',function(request,response) {
        var entertainmentSources = constants.entertainmentSources;
        var entertainmentOperations = constants.entertainmentOperations;
        var responseJson = {"sources": entertainmentSources, "operations": entertainmentOperations};
        response.json(responseJson);
      });

      app.get('/gamesources',function(request,response) {
        var gameSources = constants.gameSources;
        var gameOperations = constants.gameOperations;
        var responseJson = {"sources": gameSources, "operations": gameOperations};
        response.json(responseJson);
      });

      app.get('/forumsources',function(request,response) {
        var forumSources = constants.forumSources;
        var forumOperations = constants.forumOperations;
        var responseJson = {"sources": forumSources, "operations": forumOperations};
        response.json(responseJson);
      });

      app.get('/foodsources',function(request,response) {
        var foodSources = constants.foodSources;
        var foodOperations = constants.foodOperations;
        var responseJson = {"sources": foodSources, "operations": foodOperations};
        response.json(responseJson);
      });

      app.get('/tabOptions',function(request,response) {
        var tabJsonArray = constants.tabOptions;
        var responseData = tabJsonArray;
        response.json(tabJsonArray);
      });

      app.get('/headerOptions',function(request,response){
          var headerJsonArray = [{"iconName":"account box","iconTooltip":"User Logged In"},
                                {"iconName":"info","iconTooltip":"About the App"},
                                {"iconName":"timeline","iconTooltip":"Onyx"}];
        response.json(headerJsonArray);
      });

    // application -------------------------------------------------------------
    app.get('/', function (req, res) {
        console.log(__dirname);
        res.sendFile("C:/Users/rupachak/Documents/Github/Dragoon/public/index.html"); // load the single view file (angular will handle the page changes on the front-end)
    });
};
