var ratingPredictor = require('../prediction/predictGameRating');
var videogameParser = require('./videogameParser');
var _ = require('lodash');

var getAggregatedParsedOperationResponse = function(search_query,channelList,operationList) {
  if (_.includes(operationList,"gamepopularity")) {
      return ratingPredictor.getGameRating(search_query);
  } else {
      return videogameParser.getAggregatedParsedResponse(search_query,channelList);
  }
}

module.exports = {
  getAggregatedParsedOperationResponse: getAggregatedParsedOperationResponse
}
