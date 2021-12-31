var app = angular.module("dragoonApplication");


app.config(['$routeProvider','$locationProvider', '$httpProvider', function($routeProvider,$locationProvider,$httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
           //$locationProvider.html5Mode({enabled: true, requireBase: false});
           $routeProvider.
           when('/movies', {
              templateUrl: 'js/views/movies.html',
              controller: 'movieController'
           }).
           when('/games', {
              templateUrl: 'js/views/games.html',
              controller: 'gameController'
           }).
           when('/forums', {
              templateUrl: 'js/views/forums.html',
              controller: 'forumController'
           }).
           when('/weather', {
             templateUrl: 'js/views/weather.html',
             controller: 'weatherController'
           }).
           when('/books', {
             templateUrl: 'js/views/books.html',
             controller: 'bookController'
           }).
           when('/entertainment', {
             templateUrl: 'js/views/entertainment.html',
             controller: 'entertainmentController'
           }).
           when('/index', {
             templateUrl: 'js/views/index.html'
             //controller: 'AppCtrl'
           }).
           when('/food' , {
             templateUrl: 'js/views/food.html',
             controller: 'foodController'
           }).
           when('/sport' , {
             templateUrl: 'js/views/sports.html',
             controller: 'sportController'
           }).
           when('/comics' , {
             templateUrl: 'js/views/comics.html',
             controller: 'comicController'
           });
}]);
