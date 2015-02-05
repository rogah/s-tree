var util = require('util'),
  Segment = require('./segment');

function Interval(start, end, data) {
  Segment.apply(this, arguments);
  
  this.id = ++Interval.prototype.id;
  this.data = data;
}

util.inherits(Interval, Segment);

Interval.prototype.id = 0;

module.exports = Interval;