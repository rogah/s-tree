var util = require('util');

var Interval = require('./interval');

function IntervalSet() {
 this.intervals = [];
}

IntervalSet.prototype.push = function (start, end, data) {
  var interval = new Interval(start, end, data);
  this.intervals.push(interval);
}

IntervalSet.prototype.pushAll = function (starts, ends, data) {
  _validateIntervalsArrays(starts, ends, data);

  var i = 0, 
    length = starts.length;
  
  if (util.isArray(data)) {
    for(i = 0; i < length; i++) this.push(starts[i], ends[i], data[i]);
  } else{
    for(i = 0; i < length; i++) this.push(starts[i], ends[i]);
  } 
}

function _validateIntervalsArrays(starts, ends, data) {
  var isDataProvided = data !== undefined;

  if (!util.isArray(starts))
    throw new Error('Invalid parameter. Parementers #starts must be a Array.');

  if (!util.isArray(ends))
    throw new Error('Invalid parameter. Parementer #ends must be a Array.');

  if (isDataProvided && !util.isArray(data))
    throw new Error('Invalid parameter. Parementer #data (optional), if provided, must be a Array.');

  var haveEndpointsDiffLength = starts.length !== ends.length,
    haveDataDiffLength = isDataProvided && starts.length !== data.length;

  if (haveEndpointsDiffLength || (haveDataDiffLength && haveEndpointsDiffLength))
    throw new Error('Invalid parameter. Parementers #starts, #ends and #data (optional) must have the same length.');
}

module.exports = IntervalSet;