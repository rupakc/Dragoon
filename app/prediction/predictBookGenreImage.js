var spawn = require("child_process").spawn;
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');


var getPredictedBookGenreImage = function() {
  var pythonProcess = spawn(constants.python3CompilerPath,[constants.bookGenreImagePythonScript]);
  return new Promise(function(resolve, reject) {
    pythonProcess.stdout.on('data', function (data) {
      var resultStringList = data.toString();
      var genreDict = commonOps.deserialize(resultStringList);
      resolve(genreDict);
    });
  });
};

module.exports = {
  getPredictedBookGenreImage: getPredictedBookGenreImage
};
