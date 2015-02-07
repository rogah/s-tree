# s-tree

Node.js module implementation of [Segment Tree](http://en.wikipedia.org/wiki/Segment_tree) data structure for storing intervals, or segments. It allows querying which of the stored segments contain a given point.

## Example

```javascript
var stree = require('s-tree');

stree(function(tree) {
  
  tree
    .push(5, 10, 'foo')
    .push(8, 14, 'bar')
    .push(12, 16)
  .build();

  tree.query({ start: 10, end: 12 }, function(intervals) {
    ...
  });

});
```

## Install

    npm install s-tree

## API

### `push(start, end, [data])`
Store a interval (start, end) with a optional `data` parameter.

* `start` Start point of interval (number)
* `end` End point of interval (number)
* `data` Optinal key value (e.g. id, label or even an object) for future reference (object)

**Returns** `object` which is a reference to the tree itself` (Chain Pattern)

Example:
```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  tree.push(5, 10);
  tree.push(5, 10, 'foo');
  ...
});
```

### `build()`
Build the segment tree data structure.

**Returns** `object` which is a reference to the tree itself` (Chain Pattern)

```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  tree.build();
  ...
});
```

### `query({ start, end, [endpoints], [concurrency] }, callback)`
Query for intervals which overlap a given endpoint (start, end).

* `options`:
  * `start` Start point of interval (number)
  * `end` End point of interval (number)
  * `endpoints` optional parameter to indicate whether or not endpoints should be included on interval comparison (boolean, default: true)
  * `concurrency` optional parameter to indicate whether or not the query should look only for concurrent intervals (boolean, default: false)
* `callback` The callback function which provides the queried intervals (e.g. function(intervals) {...})

**Returns** `number` of intervals

Example:
```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  tree.query({ start: 5, end: 10 }, function(intervals) {
    ...
  });
  tree.query({ start: 5, end: 10, endpoints: false }, function(intervals) {
    ...
  });
  tree.query({ start: 5, end: 10, concurrency: true }, function(intervals) {
    ...
  });

  var numberOfIntrevals = tree.query({ start: 5, end: 10 });
  ...
});
```

### `query({ start, end, [endpoints], [concurrency] }, callback)`
Query for array of intervals which overlap the given endpoints ([start], [end]).

* `options`:
  * `start` Start points of intervals (array)
  * `end` End points of intervals (array)
  * `endpoints` optional parameter to indicate whether or not endpoints should be included on interval comparison (boolean, default: true)
  * `concurrency` optional parameter to indicate whether or not the query should look only for concurrent intervals (boolean, default: false)
* `callback` The callback function which provides the queried intervals (e.g. function(intervals) {...})

**Returns** `number` of intervals

Example:
```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  tree.query({ start: [5, 10], end: [8, 14] }, function(intervals) {
    ...
  });
  tree.query({ start: [5, 10], end: [8, 14], endpoints: false }, function(intervals) {
    ...
  });
  tree.query({ start: [5, 10], end: [8, 14], concurrency: true }, function(intervals) {
    ...
  });

  var numberOfIntrevals = tree.query({ start: [5, 10], end: [8, 14] });
  ...
});
```

### `query({ point, [endpoints], [concurrency] }, callback)`
Query for intervals which overlaps a given  point (point).

* `options`:
  * `point` Point where intervals overlap (number)
  * `endpoints` optional parameter to indicate whether or not endpoints should be included on interval comparison (boolean, default: true)
  * `concurrency` optional parameter to indicate whether or not the query should look only for concurrent intervals (boolean, default: false)
* `callback` The callback function which provides the queried intervals (e.g. function(intervals) {...})

**Returns** `number` of intervals

Example:
```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  tree.query({ point: 5 }, function(intervals) {
    ...
  });
  tree.query({ point: 5, endpoints: false }, function(intervals) {
    ...
  });
  tree.query({ point: 5, concurrency: true }, function(intervals) {
    ...
  });

  var numberOfIntrevals = tree.query({ point: 5 });
  ...
});
```

### `query({ points, [endpoints], [concurrency] }, callback)`
Query for intervals which overlaps the given points (points).

* `options`:
  * `points` Points where intervals overlap (array)
  * `endpoints` optional parameter to indicate whether or not endpoints should be included on interval comparison (boolean, default: true)
  * `concurrency` optional parameter to indicate whether or not the query should look only for concurrent intervals (boolean, default: false)
* `callback` The callback function which provides the queried intervals (e.g. function(intervals) {...})

**Returns** `number` of intervals

Example:
```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  tree.query({ points: [5, 10, 25] }, function(intervals) {
    ...
  });
  tree.query({ points: [5, 10, 25], endpoints: false }, function(intervals) {
    ...
  });
  tree.query({ points: [5, 10, 25], concurrency: true }, function(intervals) {
    ...
  });

  var numberOfIntrevals = tree.query({ points: [5, 10, 25] });
  ...
});
```

### `clear()`
Remove intervals from the data structure.

**Returns** `object` which is a reference to the tree itself` (Chain Pattern)

Example:
```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  tree.clear();
  ...
});
```

### `hasIntervals()`
Indicates whether or not there are intervals in the data structure.

**Returns** `Boolean`

Example:
```javascript
var stree = require('s-tree');

stree(function(tree) {
  ...
  if (tree.hasIntervals()) {...};
  ...
});
```
