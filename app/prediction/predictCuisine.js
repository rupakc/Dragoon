var natural = require('natural');
var fileOps = require('../utils/fileutils');
var commonOps = require('../utils/commonutils');
var constants = require('../../config/constants');

var getFoodCuisine = function(instructionList) {
  var cuisineList = [];
  var deserializedClassifier = natural.BayesClassifier.restore(commonOps.deserialize(fileOps.readFromFile(constants.cuisineClassifierPath)));
  for (var i = 0; i < instructionList.length; i++) {
    cuisineList.push(deserializedClassifier.classify(instructionList[i]));
  }
  return cuisineList;
}

module.exports = {
  getFoodCuisine: getFoodCuisine
}
