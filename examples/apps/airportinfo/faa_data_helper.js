'use strict';
var _ = require('lodash');
var requestPromise = require('request-promise');
var ENDPOINT = 'http://services.faa.gov/airport/status/';

function FAADataHelper() {

}

/*
Retrieves the airport JSON object from FAA
TESTING:
var FAADataHelper = require('./faa_data_helper.js');
var faaHelper = new FAADataHelper();
faaHelper.getAirportStatus('CLT').then(console.log);
*/
FAADataHelper.prototype.getAirportStatus = function(airportCode) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + airportCode,
    json: true
  };
  return requestPromise(options);
};


/*
Formats the FAA JSON reponse in an airport status
*/
FAADataHelper.prototype.formatAirportStatus = function(aiportStatusObject) {
  if (aiportStatusObject.delay === 'true') {
    var template = _.template('There is currently a delay for ${airport}. ' + 'The average delay time is ${delay_time}.');
    return template({
      airport: aiportStatusObject.name,
      delay_time: aiportStatusObject.status.avgDelay
    });
  } else {
    //no delay
    var template = _.template('There is currently no delay at ${airport}.');
    return template({ airport: aiportStatusObject.name });
  }
};

module.exports = FAADataHelper;
