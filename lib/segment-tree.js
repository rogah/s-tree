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

  var endpoints = this._intervalSet.getEndpoints();

  this._root = _createNodes(endpoints);

  // var fs = require('fs');
  // fs.writeFile('/Users/rogeriocarvalho/Downloads/node-new.json', JSON.stringify(this._root, null, 4), function(err) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     console.log("JSON saved to /Users/rogeriocarvalho/Downloads/node-new.json");
  //   }
  // });

  for (var i = 0; i < this._intervalSet.intervals.length; i++) {
   _insertInterval(this._root, this._intervalSet.intervals[i]);
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

SegmentTree.prototype.queryInterval = function (start, end, callback) {
  return this.queryIntervals([start], [end], callback);
}

SegmentTree.prototype.queryIntervals = function (starts, ends, callback) {
  var segments = [];

  for(var i = 0; i < starts.length; i++) {
    segments.push(new Segment(starts[i], ends[i]));
  }

  return _queryInterval(this._root, segments, callback);
}

SegmentTree.prototype.queryPoint = function (point, callback) {
  return this.queryPoints([point], callback);
}

SegmentTree.prototype.queryPoints = function (points, callback) {
  var segments = points.map(function (point) {
    return new Segment(point, point);
  });
  return _queryInterval(this._root, segments, callback);
}

SegmentTree.prototype.query = function (options, callback) {
  if (isAnEndpointArgument(options)) {
    return this.queryInterval(options.start, options.end, callback);
  }

  if (isEndpointsArgument(options)) {
    return this.queryIntervals(options.start, options.end, callback);
  }
}

function isAnEndpointArgument(options) {
  return isOptionsValid({ 
    start: '[object Number]', 
    end: '[object Number]', 
    concurrent: '[object Boolean]'
  }, options);
}

function isEndpointsArgument(options) {
  return isOptionsValid({ 
    start: '[object Array]', 
    end: '[object Array]', 
    concurrent: '[object Boolean]'
  }, options);
}

function isOptionsValid(template, options) {
  var invalid = 0;
  Object.keys(template).forEach(function (key) {
    if (options[key] === undefined || objectToString(options[key]) !== template[key])
      invalid += 1;
  });
  return invalid === 0;
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

// SegmentTree.prototype.queryConcurrencies = function (start, end, callback) {
//   var hits = {};

//   _queryConcurrencies(this._root, [new Segment(start, end)], hits);

//   var queryIntervals = Object.keys(hits).map(function(key) {
//     return hits[key];
//   });

//   if (callback !== undefined && typeof callback === 'function') 
//     callback(queryIntervals);

//   return queryIntervals.length;
// }

function _createNodes(endpoints) {
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
    node.left = _createNodes(endpoints.slice(0, center + 1));
    node.right = _createNodes(endpoints.slice(center));
  }

  return node;
}

function _insertInterval(node, interval) {
  var comparison = node.segment.compareTo(interval);

  if (comparison === Segment.SUBSET) {
    // interval of node is a subset of the specified interval or equal
    node.intervals.push(interval);
  } else if (comparison === Segment.INTERSECT || comparison === Segment.SUPERSET) {
    // interval of node is a superset, have to look in both childs
    if (node.left) _insertInterval(node.left, interval);
    if (node.right) _insertInterval(node.right, interval);
  }
}

// function _queryConcurrencies(node, queryIntervals, hits) {
//   if (node === null) return;

//   var concurrencies = [];

//   queryIntervals.forEach(function(queryInterval) {
//     if (node.segment.compareTo(queryInterval) !== Segment.DISJOINT) {
//       node.intervals.forEach(function(interval) {
//         if (queryInterval.compareTo(interval) === Segment.SUBSET) {
//           hits[interval.id] = interval;
//         }
//       });
//       concurrencies.push(queryInterval);
//     }
//   });

//   if (concurrencies.length !== 0) {
//     _queryConcurrencies(node.right, concurrencies, hits);
//     _queryConcurrencies(node.left, concurrencies, hits);
//   }
// }

// function _query(node, queryIntervals, hits) {
//   if (node === null) return;

//   var notDisjoint = [];

//   queryIntervals.forEach(function(queryInterval) {
//     if (node.segment.compareTo(queryInterval) !== Segment.DISJOINT) {
//       node.intervals.forEach(function(interval) {
//         hits[interval.id] = interval;
//       });
//       notDisjoint.push(queryInterval);
//     }
//   });

//   if (notDisjoint.length !== 0) {
//     _query(node.right, notDisjoint, hits);
//     _query(node.left, notDisjoint, hits);
//   }
// }

// function _queryInterval(root, intervals, callback) {
//   var hits = {};

//   _query(root, intervals, hits);

//   var queryIntervals = Object.keys(hits).map(function(key) {
//     return hits[key];
//   });

//   if (callback !== undefined && typeof callback === 'function') 
//     callback(queryIntervals);

//   return queryIntervals.length;
// }

function _query(node, queryIntervals, options, hits) {
  if (node === null) return;

  var notDisjoint = [];

  queryIntervals.forEach(function(queryInterval) {
    if (node.segment.compareTo(queryInterval) !== Segment.DISJOINT) {
      node.intervals.forEach(function(interval) {
        if (options && options.concurrent) {
          if (queryInterval.compareTo(interval) === Segment.SUBSET)
            hits[interval.id] = interval;
        } else {
          hits[interval.id] = interval;
        }
      });
      notDisjoint.push(queryInterval);
    }
  });

  if (notDisjoint.length !== 0) {
    _query(node.right, notDisjoint, options, hits);
    _query(node.left, notDisjoint, options, hits);
  }
}

function _queryInterval(root, intervals, options, callback) {
  var hits = {};

  _query(root, intervals, options, hits);

  var results = Object.keys(hits).map(function(key) {
    return hits[key];
  });

  if (callback !== undefined && typeof callback === 'function') 
    callback(results);

  return results.length;
}

module.exports = SegmentTree;