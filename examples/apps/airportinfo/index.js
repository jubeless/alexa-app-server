'use strict';
/*
  Notice the alexa-app library that was required - this library provides several conveniences you will leverage
  to implement the service. It also makes the skill service runnable locally,
  which you will see soon. The module.change_code = 1; declaration enables
  live reloading of the skill service when running it locally as changes are made.
*/
module.change_code = 1;

var Alexa = require('alexa-app');
var skill = new Alexa.app('airportinfo');
var FAADataHelper = require('./faa_data_helper');
var _ = require('lodash');

/*
  The onLaunch event will be triggered if a user uses the phrase "Alexa, open Airport Info",
  "Alexa, launch AirportInfo", or "Alexa, start AirportInfo".
*/
var reprompt = 'I didn\'t hear an airport code, tell me an Airport code to get delay ' + 'information for that airport.';
skill.launch(function(request, response) {
  var prompt = 'For delay information, tell me an Airport code.';
  response.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

/*
Keep in mind that the data the skill service is acting upon is simply a specially formatted
JSON payload from the skill interface.
The data that was received by your skill service resembles the following JSON structure:
"request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.xxxx",
    "intent": {
      "name": "airportInfoIntent",
      "slots": {
        "AIRPORTCODE": {
          "name": "AIRPORTCODE",
          "value": "ATL"
        }
      }
  },
    "locale": "en-US"
  }
*/
skill.intent('airportInfoIntent', {
    'slots': {
      'AIRPORTCODE': 'FAACODES'
    },
    'utterances': ['{|flight|airport} {|delay|status} {|info} {|for} {-|AIRPORTCODE}']
  },
  function(request, response) {
    var airportCode = request.slot('AIRPORTCODE');

    if (_.isEmpty(airportCode)) {
      var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
      response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    } else {
      var faaDataHelper = new FAADataHelper();
      return faaDataHelper.getAirportStatus(airportCode).then(function(airportStatus) {
        var airportStatusFormated = faaDataHelper.formatAirportStatus(airportStatus)
        console.log("airportStatusFormated: " + airportStatusFormated);
        response.say(airportStatusFormated).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for an airport code of ' + airportCode;
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
    }
  }
);

module.exports = skill;
