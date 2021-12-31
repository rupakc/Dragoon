module.exports = {
  sentimentPositive: "Positive",
  sentimentNegative: "Negative",
  sentimentNeutral: "Neutral",
  gameRatingFeatureModelPath: "models/bow.json",
  gameRatingRegressorModelPath: "models/mlr_game.json",
  supportGameRatingChannels: ["igdb"],
  cuisineClassifierPath: "models/cuisine_classifier.json",
  supportedCuisineChannels: ["mealdb"],
  foodRatingClassifierPath: "models/food_rating_classifier.json",
  supportedFoodRatingChannels: ['yummly','recipepuppy'],
  movieRatingTextFeatureModelPath: "models/bow_movie_rating.json",
  movieRatingRegressorModelPath: "models/mlr_movie_rating.json",
  supportedMovieRatingTextChannels: ["moviedb","tvdb","tvmaze"],
  foodCalorieFeatureModelPath: "models/bow_food_calories.json",
  foodCalorieRegressorModelPath: "models/mlr_food_calories.json",
  supportedCalorieRatingChannels: ["yummly","recipepuppy","edamam"],
  predictorFoodIngredientPythonScript: "/Documents/Github/Dragoon/pythonscripts/ingredient_predictor.py",
  predictorBookRatingPythonScirpt: "/Documents/Github/Dragoon/pythonscripts/book_rating_predictor.py",
  supportedBookRatingChannels: ["goodreads"],
  predictorBookGenrePythonScirpt: "Documents/Github/Dragoon/pythonscripts/book_genre_predictor_text.py",
  jokeGeneratorPythonScript:"/Documents/Github/Dragoon/pythonscripts/hmm_text.py",
  supportedJokeGenerationChannels: ["chuckjokes"],
  triviaQuestionPredictorPythonScript: "/Documents/Github/Dragoon/pythonscripts/trivia_question_type.py",
  supportedTriviaChannels: ['opentrivia'],
  closedQuestionPredictorPythonScript:'/Documents/Github/Dragoon/pythonscripts/stackoverflow_closed_question_predict.py',
  questionRatingPredictorPythonScript: '/Documents/Github/Dragoon/pythonscripts/stackoverflow_rating_predict.py',
  supportedForumChannels: ['stackoverflow'],
  python3CompilerPath: "\\AppData\\Local\\Continuum\\anaconda3\\python.exe",
  bookGenreImagePythonScript: '/Documents/Github/Dragoon/pythonscripts/book_genre_image.py',
  downloadFolderPath: 'public/downloads/',
  logFolderPath: 'logs/',
  movieGenrePosterPythonScript: '/Documents/Github/Dragoon/pythonscripts/movie_genre_poster.py',

  movieSources: [{"displayName":"OMDB","name":"omdb"},
                  {"displayName":"MovieDB","name":"moviedb"},
                  {"displayName":"TvDB","name":"tvdb"},
                  {"displayName" :"TV Maze","name":"tvmaze"},
                  {"displayName":"TasteDive","name":"tastedive"}],

 movieOperations: [{"displayName": "Predict Movie Genre","name": "genreprediction"},
                  {"displayName": "Predict Movie Sentiment","name": "sentimentprediction"},
                  {"displayName": "Predict Movie Genre from Poster", "name": "postergenreprediction"},
                  {"displayName": "Predict Movie Rating from Cast & Crew", "name": "castratingprediction"}],

 sportSources: [{"displayName":"Cricket Player Info","name":"cricketplayerinfo"},
               {"displayName":"SportsDB","name":"sportsdb"},
               {"displayName":"Football Org","name":"football"},
               {"displayName": "F1 Season Info","name":"f1"},
               {"displayName": "JC Decaux Bike Info","name":"bikerental"},
               {"displayName": "Current Cricket Matches", "name":"currentmatchcricket"},
               {"displayName": "Cricket Match Calendar", "name": "cricketmatchcalendar"},
               {"displayName": "UFC Info Data", "name": "ufc"}],

 sportOperations: [{"displayName": "Match Outcome Prediction","name": "outcomeprediction"},
                   {"displayName": "Player Rating Prediction","name": "playerrating"}],

 weatherSources: [{"displayName": "OpenWeatherMap", "name": "openweathermap"},
                  {"displayName": "WeatherBit", "name": "weatherbit"},
                  {"displayName": "OpenUVData","name": "openuvdata"},
                  {"displayName": "StormGlass", "name": "stormglass"},
                  {"displayName": "DarkSky", "name": "darksky"}],

 weatherOperations: [{"displayName": "Weather Forecast", "name":"forecast"},
                     {"displayName": "Correlate Environment Variables", "name":"correlateenv"}],

 bookSources:  [{"displayName": "Goodreads","name": "goodreads"}],

 comicSources: [{"displayName": "Marvel Comics", "name": "marvelcomics"},
                {"displayName": "Comic Vine","name": "comicvine"}],

 bookOperations: [{"displayName": "Predict Book Rating", "name": "ratingprediction"},
                  {"displayName": "Predict Book Genre (from text)", "name": "genreprediction"},
                  {"displayName": "Predict Book Genre (from cover)", "name": "genrepredictionimage"}],

 entertainmentSources: [{"displayName": "Jeopardy Trivia","name":"jeopardy"},
                        {"displayName": "Open Trivia","name": "opentrivia"},
                        {"displayName": "Chuck Norris Jokes","name": "chuckjokes"},
                        {"displayName": "Random Ten Dev Jokes","name": "randtendev"},
                        {"displayName": "ICanHazDad Jokes","name": "icanhazdad"},
                        {"displayName": "YoMama Jokes","name": "yomama"}],

 entertainmentOperations: [{"displayName": "Generate New Jokes", "name": "jokegenerator"},
                          {"displayName": "Predict Trivia Question Type", "name": "questiontypepredictor"}],

 gameSources: [{"displayName":"Internet Game Database","name":"igdb"},
               {"displayName": "Giant Bomb","name":"giantbomb"}],

 gameOperations: [{"displayName": "Predict Game Popularity", "name": "gamepopularity"}],

 tabOptions: [{"iconName":"movie_filter","iconTooltip":"Movies/TV Shows","url":"#/movies"},
              {"iconName":"videogame_asset","iconTooltip":"Video Games","url":"#/games"},
              {"iconName":"forum","iconTooltip":"Forums","url":"#/forums"},
              {"iconName":"cloud","iconTooltip":"Weather/Air Quality","url":"#/weather"},
              {"iconName":"book","iconTooltip":"Books","url":"#/books"},
              {"iconName":"mood","iconTooltip":"Jokes/Entertainment","url":"#/entertainment"},
              {"iconName":"fastfood","iconTooltip":"Food/Recipe/Drinks","url":"#/food"},
              {"iconName":"directions_bike","iconTooltip":"Sports/Leagues","url":"#/sport"},
              {"iconName":"child_care","iconTooltip":"Comics","url":"#/comics"}],

 foodOperations: [{"displayName": "Recipe Ingredient Prediction", "name": "ingredientprediction"},
                  {"displayName": "Recipe Calorie Prediction", "name": "calorieprediction"},
                  {"displayName": "Recipe Rating Prediction", "name": "ratingprediction"},
                  {"displayName": "Recipe Cuisine Prediction", "name": "cuisineprediction"}],

 foodSources:   [{"displayName": 'Recipe Puppy',"name":"recipepuppy"},
                {"displayName": 'Yummly',"name":"yummly"},
                {"displayName": 'Food2Fork',"name": "food2fork"},
                {"displayName": 'MealDB',"name": "mealdb"},
                {"displayName": 'CocktailDB',"name": "cocktaildb"},
                {"displayName": 'Beer Punk', "name": "beerpunk"},
                {"displayName": 'Edamam',"name": "edamam"}],

 forumSources: [{"displayName":"StackOverflow","name":"stackoverflow"},
                {"displayName": "Disqus","name":"disqus"}],

 forumOperations: [{"displayName":"Predict Closed Question", "name": "closedquestionpredict"},
                   {"displayName":"Predict Question Rating", "name": "questionrating"}]
}
