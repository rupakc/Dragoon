var spawn = require("child_process").spawn;
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');


var getGeneratedJokes = function(channelName,jokeNum=20) {
  var pythonProcess = spawn('python',[constants.jokeGeneratorPythonScript, jokeNum]);
  return new Promise(function(resolve, reject) {
    pythonProcess.stdout.on('data', function (data) {
      var resultStringList = data.toString();
      var jokeList = resultStringList.split("|")
      resolve(jokeList);
    });
    pythonProcess.stderr.on('data', function(error) {
      reject(error);
    });
  });
}

module.exports = {
  getGeneratedJokes: getGeneratedJokes
};
