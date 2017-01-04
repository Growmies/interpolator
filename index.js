const moment = require('moment');
const _      = require('lodash');

module.exports = {
  interpolateSpecialValues: interpolateSpecialValues
};

function manipulateDate(date, prompt) {
  const startOfTimeRegex = /start of (year|month|quarter|week|isoWeek|day|hour|minute|second)/;
  const endOfTimeRegex = /end of (year|month|quarter|week|isoWeek|day|hour|minute|second)/;
  const addSubTimeRegex  = /([-+])(\d+)(seconds|minutes|hours|days|weeks|months|years)/;
  let parts;
  let period;

  //something like '-1years'
  if (addSubTimeRegex.test(prompt)) {
    parts         = addSubTimeRegex.exec(prompt);
    let direction = parts[1] == '-' ? 'subtract' : 'add';
    let amount    = parseInt(parts[2], 10);
    period        = parts[3];
    return date[direction](amount, period);
  }

  //something like 'start of year'
  if (startOfTimeRegex.test(prompt)) {
    parts  = startOfTimeRegex.exec(prompt);
    period = parts[1];
    return date.startOf(period);
  }

  //something like 'end of year'
  if (endOfTimeRegex.test(prompt)) {
    parts  = endOfTimeRegex.exec(prompt);
    period = parts[1];
    return date.endOf(period);
  }

  //if we get here, we assume we have a format string like 'YYYY-MM-DD'
  return date.format(prompt);
}

function interpolateSpecialValues(obj) {
  if (!obj) {
    return obj;
  }
  let objStr  = JSON.stringify(obj);
  let matches = objStr.match(/\{\{date\([^\}]+\)\}\}/g);

  //do this forEach {{date(...)}} that we find
  _.each(matches, (preInterpolatedStr) => {

    let parts            = /\{\{date\(([^\)]+)\)\}\}/.exec(objStr);

    if(!parts) {
      throw new Error('Bad Object Interpolation Input');
    }
    let insideDateParens = parts[1];
    let momentPrompts    = _.map(insideDateParens.split(','), (momentPrompt) => {
      return _.trim(momentPrompt, " '");
    });

    let date = moment();
    _.each(momentPrompts, (prompt) => {
      date = manipulateDate(date, prompt);
      //once we hit the format prompt, we'll break out of the prompts. So format prompt needs to be last
      if (_.isString(date)) {
        return false;
      }
    });

    date   = !_.isString(date) ? date.format('YYYY-MM-DD') : date;
    objStr = objStr.replace(preInterpolatedStr, date);
  });

  return JSON.parse(objStr);
}

