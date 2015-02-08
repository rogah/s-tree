var IntervalSet = require('./interval-set'),
  Node = require('./node'),
  Segment = require('./segment');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function validateIntervalSet(intervalSet) {
  if (!intervalSet.hasIntervals()) {
    throw new Error('There is no interval available.');
  }
}

function createNodes(endpoints) {
  var node;

  if (endpoints.length === 2) {
    node = new Node(endpoints[0], endpoints[1]);

    if (endpoints[1] !== Infinity) {
      node.left = new Node(endpoints[0], endpoints[1]);
      node.right = new Node(endpoints[1], endpoints[1]);
    }
  } else {
    node = new Node(endpoints[0], endpoints[endpoints.length - 1]);

    var center = Math.floor(endpoints.length / 2);
    node.left = createNodes(endpoints.slice(0, center + 1));
    node.right = createNodes(endpoints.slice(center));
  }

  return node;
}

function distributeIntervals(node, interval) {
  var nodeSegment = node.segment;

  if (nodeSegment.isSubsetOf(interval)) {
    node.intervals.push(interval);
  } else if (!nodeSegment.isDisjointOf(interval)) {
    if (node.left) {
      distributeIntervals(node.left, interval);
    }
    if (node.right) {
      distributeIntervals(node.right, interval);
    }
  }
}

function query(node, segments, endpoints, concurrency, hits) {
  if (node === null) {
    return;
  }

  var overlaps = [];

  segments.forEach(function (segment) {
    if (node.segment.overlapWith(segment, endpoints)) {
      node.intervals.forEach(function (interval) {
        if (concurrency) {
          if (segment.isSubsetOf(interval)) {
            hits[interval.id] = interval;
          }
        } else {
          hits[interval.id] = interval;
        }
      });
      overlaps.push(segment);
    }
  });

  if (overlaps.length !== 0) {
    query(node.right, overlaps, endpoints, concurrency, hits);
    query(node.left, overlaps, endpoints, concurrency, hits);
  }
}

function querySegments(root, segments, endpoints, concurrency, callback) {
  var hits = {};

  query(root, segments, endpoints, concurrency, hits);

  var results = Object.keys(hits).map(function (key) {
    return hits[key];
  });

  if (callback !== undefined && typeof callback === 'function') {
    callback(results);
  }

  return results.length;
}

function queryIntervals(root, options, callback) {
  var segments = [],
    length = options.start.length,
    i = 0;

  for (i = 0; i < length; i++) {
    segments.push(new Segment(options.start[i], options.end[i]));
  }

  return querySegments(root, segments, options.endpoints, options.concurrency, callback);
}

function queryInterval(root, options, callback) {
  options.start = [options.start];
  options.end = [options.end];
  return queryIntervals(root, options, callback);
}

function queryPoints(root, options, callback) {
  var segments = options.points.map(function (point) {
    return new Segment(point, point);
  });

  return querySegments(root, segments, options.endpoints, options.concurrency, callback);
}

function queryPoint(root, options, callback) {
  options.points = [options.point];
  return queryPoints(root, options, callback);
}

function validateOptions(options, properties) {
  var invalid = 0,
    propertyNames = Object.keys(options);

  Object.keys(properties).forEach(function (key) {
    var propertyInfo = properties[key],
      propertyValue = options[key];

    if (propertyInfo.optional) {
      if (propertyValue !== undefined && objectToString(propertyValue) !== propertyInfo.type) {
        invalid += 1;
      }
    } else {
      if (propertyValue === undefined || objectToString(propertyValue) !== propertyInfo.type) {
        invalid += 1;
      }
    }

    if (propertyInfo.default !== undefined && propertyValue === undefined && objectToString(propertyInfo.default) === propertyInfo.type) {
      options[key] = propertyInfo.default;
    }

    var index = propertyNames.indexOf(key);
    if (index > -1) {
      propertyNames.splice(index, 1);
    }
  });

  return invalid === 0 && propertyNames.length === 0;
}

function hasQueryIntervalArguments(options) {
  var properties = {
    start: {
      type: '[object Number]'
    },
    end: {
      type: '[object Number]'
    },
    endpoints: {
      type: '[object Boolean]',
      optional: true,
      default: true
    },
    concurrency: {
      type: '[object Boolean]',
      optional: true,
      default: false
    }
  };
  return validateOptions(options, properties);
}

function hasQueryIntervalsArguemnts(options) {
  var properties = {
    start: {
      type: '[object Array]'
    },
    end: {
      type: '[object Array]'
    },
    endpoints: {
      type: '[object Boolean]',
      optional: true,
      default: true
    },
    concurrency: {
      type: '[object Boolean]',
      optional: true,
      default: false
    }
  };
  return validateOptions(options, properties);
}

function hasQueryPointArguments(options) {
  var properties = {
    point: {
      type: '[object Number]'
    },
    endpoints: {
      type: '[object Boolean]',
      optional: true,
      default: true
    },
    concurrency: {
      type: '[object Boolean]',
      optional: true,
      default: false
    }
  };
  return validateOptions(options, properties);
}

function hasQueryPointsArguments(options) {
  var properties = {
    points: {
      type: '[object Array]'
    },
    endpoints: {
      type: '[object Boolean]',
      optional: true,
      default: true
    },
    concurrency: {
      type: '[object Boolean]',
      optional: true,
      default: false
    }
  };
  return validateOptions(options, properties);
}

function SegmentTree() {
  this.root = null;
  this.intervalSet = new IntervalSet();
}

SegmentTree.prototype.hasIntervals = function () {
  return this.intervalSet.hasIntervals();
};

SegmentTree.prototype.push = function (start, end, data) {
  this.intervalSet.push(start, end, data);
  return this;
};

SegmentTree.prototype.clear = function () {
  this.root = null;
  this.intervalSet.clear();
  return this;
};

SegmentTree.prototype.build = function () {
  validateIntervalSet(this.intervalSet);

  var endpoints = this.intervalSet.getEndpoints(),
    intervals = this.intervalSet.intervals,
    length = intervals.length,
    i = 0;

  this.root = createNodes(endpoints);

  for (i = 0; i < length; i++) {
    distributeIntervals(this.root, intervals[i]);
  }

  return this;
};

SegmentTree.prototype.isBuilt = function () {
  return this.root !== null;
};

SegmentTree.prototype.query = function (options, callback) {
  if (options === undefined) {
    throw new Error('Options should be provided.');
  }

  if (hasQueryIntervalArguments(options)) {
    return queryInterval(this.root, options, callback);
  } else if (hasQueryIntervalsArguemnts(options)) {
    return queryIntervals(this.root, options, callback);
  } else if (hasQueryPointArguments(options)) {
    return queryPoint(this.root, options, callback);
  } else if (hasQueryPointsArguments(options)) {
    return queryPoints(this.root, options, callback);
  }

  throw new Error('The options provided are invalid to query intervals.');
};

module.exports = SegmentTree;
