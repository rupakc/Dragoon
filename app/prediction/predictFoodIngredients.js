var spawn = require("child_process").spawn;
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');


var getPredictedFoodIngredients = function(foodNameList) {
  var foodNameString = foodNameList.join("|");
  var pythonProcess = spawn('python',[constants.predictorFoodIngredientPythonScript, foodNameString]);
  return new Promise(function(resolve, reject) {
    pythonProcess.stdout.on('data', function (data) {
      var resultJson = commonOps.deserialize(data.toString());
      var ingredientList = [];
      for (var i = 0; i < foodNameList.length; i++) {
        ingredientList.push(resultJson[foodNameList[i]]);
      }
      resolve(ingredientList);
    });
    pythonProcess.stderr.on('data', function(error) {
      reject(error);
    });
  });
}

module.exports = {
  getPredictedFoodIngredients: getPredictedFoodIngredients
}
