# Dragoon
Bringing the Fun back to Machine Learning

## Vision

Most machine learning applications today are built in Python, which is great given the awesome support of ML libraries in Python. The primary goal of this project is to explore the use of Javascript for ML. It is developed on the MEAN stack, using popular open-source javascript libraries for ML. 

It is a real-time system for interactively querying a multitude of data sources and getting the predictions/analysis on the fly. To speed things up we have used Memcached for storing the trained ML models and other related meta-data. 

Presently we collect data from following sources - 

  - Movies - OMDB, MovieDB, TVDB, TVMaze, TasteDive
  - Game Sources - Internet Game Database, Giant Bomb
  - Forums - Stackoverflow, Disqus
  - Weather - OpenweatherMap, WeatherBit, DarkSky, StormGlass, OpenUVData, Visual Air Quality
  - Books/Comics - Goodreads, Comic Vine, Marvel Comics
  - Jokes/Entertainment - OpenTrivia, Jeopardy, YoMama Jokes, Chuck Norris Jokes, IcanHazDad Jokes, RandomDevJokes
  - Food/Drinks - Yummly, Recipe Puppy, Food2Fork, The MealDB, Edamam, The Cocktail DB, Beer Punk
  - Sports/Leagues - Cricket, The SportsDB, F-1 Race Data, World Wresting Data, JC Decaux Bike Info, Football.org
 
## System Architecture

![architecture image][logo]

[logo]: https://github.com/rupakc/Dragoon/blob/main/dragoon-architecture.PNG "System Data Flow"

The present system uses the classical event-driven, single loop, server architecture which is characteristic of <b> Node JS </b> application, coupled with Express JS middleware, we seemlessly define REST endpoints for all client operations. Plans are also in order to integrate <b> Graph QL </b> in the current framework.

The UI is built in <b> Angular </b>, using a combination of <b> Material Design </b> and <b> UI Bootstrap </b>.
