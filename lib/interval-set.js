var util = require('util');

var Interval = require('./interval');

function validateIntervals(starts, ends, data) {
  var isDataProvided = data !== undefined;

  if (!util.isArray(starts)) {
    throw new Error('Invalid parameter. Parementers #starts must be a Array.');
  }

  if (!util.isArray(ends)) {
    throw new Error('Invalid parameter. Parementer #ends must be a Array.');
  }

  if (isDataProvided && !util.isArray(data)) {
    throw new Error('Invalid parameter. Parementer #data (optional), if provided, must be a Array.');
  }

  var haveEndpointsDiffLength = starts.length !== ends.length,
    haveDataDiffLength = isDataProvided && util.isArray(data) && starts.length !== data.length;

  if (haveEndpointsDiffLength || haveDataDiffLength) {
    throw new Error('Invalid parameter. Parementers #starts, #ends and #data (optional) must have the same length.');
  }
}

function sortAndDeDup(unordered, compareFn) {
  var result = [],
    previous;

  unordered.sort(compareFn).forEach(function (item) {
    var equal = previous !== undefined ? compareFn(previous, item) === 0 : previous === item;

    if (!equal) {
      result.push(item);
      previous = item;
    }
  });

  return result;
}

function IntervalSet() {
  this.intervals = [];
}

IntervalSet.prototype.push = function (start, end, data) {
  var interval = new Interval(start, end, data);
  this.intervals.push(interval);
};

IntervalSet.prototype.pushAll = function (starts, ends, data) {
  validateIntervals(starts, ends, data);

  var i = 0,
    length = starts.length;

  if (util.isArray(data)) {
    for (i = 0; i < length; i++) {
      this.push(starts[i], ends[i], data[i]);
    }
  } else {
    for (i = 0; i < length; i++) {
      this.push(starts[i], ends[i]);
    }
  }
};

IntervalSet.prototype.clear = function () {
  this.intervals.length = 0;
  Interval.prototype.id = 0;
};

IntervalSet.prototype.getEndpoints = function () {
  var endpoints = [-Infinity, Infinity];

  this.intervals.forEach(function (interval) {
    endpoints.push(interval.start);
    endpoints.push(interval.end);
  });

  return sortAndDeDup(endpoints, function (a, b) {
    return (a - b);
  });
};

IntervalSet.prototype.hasIntervals = function () {
  return this.intervals.length > 0;
};

module.exports = IntervalSet;
