var spawn = require("child_process").spawn;
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');


var getPredictedQuestionRating = function(questionListString) {
  var pythonProcess = spawn('python',[constants.questionRatingPredictorPythonScript, questionListString]);
  return new Promise(function(resolve, reject) {
    pythonProcess.stdout.on('data', function (data) {
      var resultStringList = data.toString();
      var questionTypeList = resultStringList.split("|")
      resolve(questionTypeList);
    });
    pythonProcess.stderr.on('data', function(error) {
      reject(error.toString());
    });
  });
}

module.exports = {
  getPredictedQuestionRating: getPredictedQuestionRating
};
