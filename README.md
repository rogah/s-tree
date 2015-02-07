# s-tree

Node.js module implementation of [Segment Tree](http://en.wikipedia.org/wiki/Segment_tree) tree data structure for storing intervals, or segments. It allows querying which of the stored segments contain a given point.

## Installation

    npm install s-tree

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

})
```
