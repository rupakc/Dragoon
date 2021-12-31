const mimir = require('mimir');
var bow = mimir.bow;
var dict = mimir.dict;

var sortDictByValues = function(dict,topN = 500) {
  var items = Object.keys(dict).map(function(key) {
      return [key, dict[key]];
  });

  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  var topNItems = items.slice(0,topN);
  var topNDict = {};
  for (var i = 0; i < topNItems.length; i++) {
    topNDict[topNItems[i][0]] = topNItems[i][1];
  }
  return topNDict;
}

var getVocabularyObject = function(textList) {
    var vocabObject = dict(textList);
    var sortedTopDict = sortDictByValues(vocabObject.dict);
    vocabObject.dict = sortedTopDict;
    vocabObject.words = Object.keys(sortedTopDict);
    return vocabObject;
};

var getBagOfWordsVector = function(textList,vocabObject) {
  var bowVectorList = [];
  for (var i = 0; i < textList.length; i++) {
    bowVectorList.push(bow(textList[i],vocabObject));
  }
  return bowVectorList;
};

var removeNewLines = function(text) {
    return text.replace(new RegExp( "\\n", "g" ),'');
};

var removeBrackets = function(text) {
  return text.replace("(","").replace(")","");
}

module.exports = {
  getVocabularyObject: getVocabularyObject,
  getBagOfWordsVector: getBagOfWordsVector,
  removeNewLines: removeNewLines,
  removeBrackets: removeBrackets
};
