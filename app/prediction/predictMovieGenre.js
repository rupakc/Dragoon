var spawn = require("child_process").spawn;
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');


var getPredictedMovieGenrePoster = function() {
  var pythonProcess = spawn(constants.python3CompilerPath,[constants.movieGenrePosterPythonScript]);
  return new Promise(function(resolve, reject) {
    pythonProcess.stdout.on('data', function (data) {
      var resultStringList = data.toString();
      var genreDict = commonOps.deserialize(resultStringList);
      resolve(genreDict);
    });
  });
};

module.exports = {
  getPredictedMovieGenrePoster: getPredictedMovieGenrePoster
};
