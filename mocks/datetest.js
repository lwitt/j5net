var moment = require("moment");

var data = { id: '11',
  start: '2017-07-06T22:00:00.000Z',
  end: '2017-07-07T21:59:59.000Z' };

console.log(data);
var a = moment.utc(data.begin);
var b = a.subtract(2,'hours');
console.log(b.format());
