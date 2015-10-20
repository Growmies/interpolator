object-interpolator takes an object and replaces date tokens with date formats

##Install
```
npm install object-interpolator
```

##Purpose
Allows for strings or objects containing strings in a particular format to be interpolated to a date String.  
This would allow for a string to "always" be 30 days in the past. "{{date('-30days', 'YYYY-MM-DD')}}"  


##Usage
```Javascript
var interpolator = require('object-interpolator');

var obj = {
  a: 'test',
  b: 'test',
  c: "{{date('YYYY-MM-DD')}}",
  d: "{{date('-1days', 'YYYY-MM-DD')}}",
  e: "{{date('YYYY-MM-DD')}}",
  f: "{{date('-30days', 'YYYY-MM-DD')}}",
  g: "{{date('-1years', '-1years', 'start of year')}}"
};

var newObj = interpolator.interpolateSpecialValues(obj);

//{ a: 'test',
//b: 'test',
//c: '2015-04-08',
//d: '2015-04-07',
//e: '2015-04-08',
//f: '2015-03-09',
//g: '2014-01-01' }
```

##Notes
You can + or - any # of (seconds|minutes|hours|days|weeks|months|years)  
You can start of (year|month|quarter|week|isoWeek|day|hour|minute|second)  
You can now pass multiple date prompts together, like in example 'g'  
If no format is given, it will default to YYYY-MM-DD  