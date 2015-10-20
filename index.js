var moment = require('moment');
var _      = require('lodash');

module.exports = {
  interpolateSpecialValues: interpolateSpecialValues
};

function manipulateDate(date, prompt) {
  var parts;
  var period;
  var addSubTimeRegex = /([-+])(\d+)(seconds|minutes|hours|days|weeks|months|years)/;
  var startOfTimeRegex = /start of (year|month|quarter|week|isoWeek|day|hour|minute|second)/;

  //something like '-1years'
  if(addSubTimeRegex.test(prompt)){
    parts = addSubTimeRegex.exec(prompt);
    var direction = parts[1] == '-' ? 'subtract' : 'add';
    var amount    = parseInt(parts[2], 10);
    period    = parts[3];
    return date[direction](amount, period);
  }

  //something like 'start of year'
  if(startOfTimeRegex.test(prompt)){
    parts = startOfTimeRegex.exec(prompt);
    period = parts[1];
    return date.startOf(period);
  }

  //if we get here, we assume we have a format string like 'YYYY-MM-DD'
  return date.format(prompt);
}

function interpolateSpecialValues(obj) {
  var objStr = JSON.stringify(obj);
    var matches = objStr.match(/\{\{date\([^\}]+\)\}\}/g);

    //do this forEach {{date(...)}} that we find
    _.each(matches, function(preInterpolatedStr) {

      var parts = /\{\{date\(([^\)]+)\)\}\}/.exec(objStr);
      var insideDateParens = parts[1];
      var momentPrompts = _.map(insideDateParens.split(','), function(momentPrompt){
        return _.trim(momentPrompt, " '");
      });

      var date = moment();
      _.each(momentPrompts, function(prompt){
        date = manipulateDate(date, prompt);
        //once we hit the format prompt, we'll break out of the prompts. So format prompt needs to be last
        if (_.isString(date)) {
          return false;
        }
      });

      date = !_.isString(date) ? date.format('YYYY-MM-DD') : date;
      objStr = objStr.replace(preInterpolatedStr, date);
    });

  return JSON.parse(objStr);
}

