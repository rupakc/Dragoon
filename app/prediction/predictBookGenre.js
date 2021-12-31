var spawn = require("child_process").spawn;
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');


var getPredictedBookGenre = function(authorTitleString) {
  var pythonProcess = spawn('python',[constants.predictorBookGenrePythonScirpt, authorTitleString]);
  return new Promise(function(resolve, reject) {
    pythonProcess.stdout.on('data', function (data) {
      var resultStringList = data.toString();
      var genreList = resultStringList.split("|")
      resolve(genreList);
    });
    pythonProcess.stderr.on('data', function(error) {
      reject(error);
    });
  });
}

module.exports = {
  getPredictedBookGenre: getPredictedBookGenre
};
