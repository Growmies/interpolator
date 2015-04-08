object-interpolator takes an object and replaces date tokens with date formats

##Install
```
npm install object-interpolator
```

##Usage
```Javascript
var interpolator = require('object-interpolator');

var obj = {
  a: 'test',
  b: 'test',
  c: "{{date('YYYY-MM-DD')}}",
  d: "{{date('-1days', 'YYYY-MM-DD')}}",
  e: "{{date('YYYY-MM-DD')}}",
  f: "{{date('-30days', 'YYYY-MM-DD')}}"
};

var newObj = interpolator.interpolateSpecialValues(obj);

//{ a: 'test',
//b: 'test',
//c: '2015-04-08',
//d: '2015-04-07',
//e: '2015-04-08',
//f: '2015-03-09' }
```