var IntervalSet = require('./interval-set'),
  Node = require('./node'),
  Segment = require('./segment');

function SegmentTree() {
  this._intervalSet = new IntervalSet();
  this._root = null;
}

SegmentTree.prototype.push = function (start, end, data) {
  this._intervalSet.push(start, end, data);
}

SegmentTree.prototype.clear = function () {
  this._intervalSet.clear();
}

SegmentTree.prototype.build = function () {
  if (!this._intervalSet.hasIntervals())
    throw new Error('There is no interval.');

  var endpoints = this._intervalSet.getEndpoints(),
    intervals = this._intervalSet.intervals,
    length = intervals.length,
    i = 0;

  this._root = createNodes(endpoints);

  // var fs = require('fs');
  // fs.writeFile('/Users/rogeriocarvalho/Downloads/node-new.json', JSON.stringify(this._root, null, 4), function(err) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     console.log("JSON saved to /Users/rogeriocarvalho/Downloads/node-new.json");
  //   }
  // });

  for (i = 0; i < length; i++) {
   distributeIntervals(this._root, intervals[i]);
  }

  // var fs = require('fs');
  // fs.writeFile('/Users/rogeriocarvalho/Downloads/tree-new.json', JSON.stringify(this._root, null, 4), function(err) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     console.log("JSON saved to /Users/rogeriocarvalho/Downloads/tree-new.json");
  //   }
  // });
}

SegmentTree.prototype.query = function (options, callback) {
  
  if (hasQueryIntervalArguments(options))
    return queryInterval(this._root, options, callback);

  else if (hasQueryIntervalsArguemnts(options))
    return queryIntervals(this._root, options, callback);

  else if (hasQueryPointArguments(options))
    return queryPoint(this._root, options, callback);

  else if (hasQueryPointsArguments(options))
    return queryPoints(this._root, options, callback);

  throw new Error('Invalid query options provided.');
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
  var comparison = node.segment.compareTo(interval);

  if (comparison === Segment.SUBSET) {
    // interval of node is a subset of the specified interval or equal
    node.intervals.push(interval);
  } else if (comparison === Segment.INTERSECT || comparison === Segment.SUPERSET) {
    // interval of node is a superset, have to look in both childs
    if (node.left) distributeIntervals(node.left, interval);
    if (node.right) distributeIntervals(node.right, interval);
  }
}

function queryInterval(root, options, callback) {
  options.start = [options.start];
  options.end = [options.end];
  return queryIntervals(root, options, callback);
}

function queryIntervals(root, options, callback) {
  var segments = [],
    concurrency = options.concurrency || false,
    length = options.start.length, 
    i = 0;

  for(i = 0; i < length; i++)
    segments.push(new Segment(options.start[i], options.end[i]));

  return querySegments(root, segments, concurrency, callback);
}

function queryPoint(root, options, callback) {
  options.points = [options.point];
  return queryPoints(root, options, callback);
}

function queryPoints(root, options, callback) {
  var concurrency = options.concurrency || false;

  var segments = options.points.map(function (point) {
    return new Segment(point, point);
  });

  return querySegments(root, segments, concurrency, callback);
}

function hasQueryIntervalArguments(options) {
  var properties = { 
    start: { type: '[object Number]' },
    end: { type: '[object Number]' }, 
    concurrency: { type: '[object Boolean]', optional: true }
  }
  return validateOptions(options, properties);
}

function hasQueryIntervalsArguemnts(options) {
  var properties = { 
    start: { type: '[object Array]' },
    end: { type: '[object Array]' }, 
    concurrency: { type: '[object Boolean]', optional: true }
  }
  return validateOptions(options, properties);
}

function hasQueryPointArguments(options) {
  var properties = { 
    point: { type: '[object Number]' },
    concurrency: { type: '[object Boolean]', optional: true }
  }
  return validateOptions(options, properties);
}

function hasQueryPointsArguments(options) {
  var properties = { 
    points: { type: '[object Array]' },
    concurrency: { type: '[object Boolean]', optional: true }
  }
  return validateOptions(options, properties);
}

function validateOptions(options, properties) {
  var invalidProperties = 0,
    propertyNames = Object.keys(options);

  Object.keys(properties).forEach(function (key) {
    var propertyInfo = properties[key],
      propertyValue = options[key],
      differentPropertyType = objectToString(propertyValue) !== propertyInfo.type;
    
    if (propertyInfo.optional) {
      if (propertyValue !== undefined && differentPropertyType)
        invalidProperties += 1;
    } else {
      if (propertyValue === undefined || differentPropertyType)
        invalidProperties += 1;
    }

    var index = propertyNames.indexOf(key);
    if (index > -1) propertyNames.splice(index, 1);
  });

  var propertiesAreValid = invalidProperties === 0,
    allPropertiesValidated = propertyNames.length === 0;

  return propertiesAreValid && allPropertiesValidated;
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function querySegments(root, segments, concurrency, callback) {
  var hits = {};

  query(root, segments, concurrency, hits);

  var results = Object.keys(hits).map(function(key) {
    return hits[key];
  });

  if (callback !== undefined && typeof callback === 'function') 
    callback(results);

  return results.length;
}

function query(node, segments, concurrency, hits) {
  if (node === null) return;

  var notDisjoint = [];

  segments.forEach(function(segment) {
    if (node.segment.compareTo(segment) !== Segment.DISJOINT) {
      node.intervals.forEach(function(interval) {
        if (concurrency) {
          if (segment.compareTo(interval) === Segment.SUBSET)
            hits[interval.id] = interval;
        } else {
          hits[interval.id] = interval;
        }
      });
      notDisjoint.push(segment);
    }
  });

  if (notDisjoint.length !== 0) {
    query(node.right, notDisjoint, concurrency, hits);
    query(node.left, notDisjoint, concurrency, hits);
  }
}

module.exports = SegmentTree;