var spawn = require("child_process").spawn;
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');


var getPredictedBookRating = function(authorTitleList) {
  var authorTitleString = authorTitleList.join("|");
  var pythonProcess = spawn('python',[constants.predictorBookRatingPythonScirpt, authorTitleString]);
  return new Promise(function(resolve, reject) {
    pythonProcess.stdout.on('data', function (data) {
      var resultStringList = data.toString();
      resultStringList = resultStringList.replace("[ ","").replace("]","");
      var ratingList = resultStringList.split("  ");
      resolve(ratingList);
    });
    pythonProcess.stderr.on('data', function(error) {
      reject(error);
    });
  });
}

module.exports = {
  getPredictedBookRating: getPredictedBookRating
}
