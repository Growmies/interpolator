var moment = require('moment'),
    _      = require('lodash');

module.exports = {
  interpolateSpecialValues: interpolateSpecialValues
}

var specialInterpolators = [
  {
    matcher: /\{\{date\('([-+])(\d+)(seconds|minutes|hours|days|weeks|months|years)'(?:,\s*'([^)]+)')?\)\}\}/, // Matches things like date('-30days', 'YYYY-mm-dd') or date('-2weeks')
    interpolate: function(value) {
      var parts     = this.matcher.exec(value),
        direction = parts[1] == '-' ? 'subtract' : 'add',
        amount    = parseInt(parts[2], 10),
        period    = parts[3],
        format    = parts[4] || 'YYYY-MM-DD';
      return value.replace(parts[0], moment()[direction](amount, period).format(format));
    }
  },
  {
    matcher: /\{\{date\('([^)]+)'\)\}\}/, // Matches things like date('YYYY-mm-dd HH:MM:SS')
    interpolate: function(value) {
      var parts  = this.matcher.exec(value),
          format = parts[1];
      return value.replace(parts[0], moment().format(format));
    }
  }
];

function interpolateSpecialValues(obj) {
  var objStr = JSON.stringify(obj);
  if (objStr.indexOf && objStr.indexOf('{{') >= 0 && objStr.indexOf('}}') >= 0) {
    var matches = objStr.match(/\{\{/g);
    for (var i = 0; i < matches.length; i++) {
      var interpolator = _.find(specialInterpolators, function(interpolator) {
        return interpolator.matcher.test(objStr);
      });
      objStr = interpolator.interpolate(objStr);  
    }
  }
  return JSON.parse(objStr);
}

