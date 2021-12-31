var fileOps = require('../utils/fileutils');
var commonOps = require('../utils/commonutils');
var natural = require('natural');
var constants = require('../../config/constants');
var _ = require('lodash');

var getFoodRating = function(ingredientNameList) {
  var deserializedClassifier = natural.BayesClassifier.restore(commonOps.deserialize(fileOps.readFromFile(constants.foodRatingClassifierPath)));
  var ratingList = [];
  for (var i = 0; i < ingredientNameList.length; i++) {
    ratingList.push(deserializedClassifier.classify(ingredientNameList[i]));
  }
  return ratingList;
};

module.exports = {
  getFoodRating: getFoodRating
}
