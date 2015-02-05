var Segment = require('./segment');

function Node(start, end) {
  this.left = null;
  this.right = null;
  this.segment = new Segment(start, end);
  this.intervals = [];
}

module.exports = Node;