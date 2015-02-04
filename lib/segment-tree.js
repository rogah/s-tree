var IntervalSet = require('./interval-set');

function SegmentTree() {
  this._intervalSet = new IntervalSet();
}

SegmentTree.prototype.build = function () {
  if (!this._intervalSet.hasIntervals())
    throw new Error('There is no interval.');
}

module.exports = SegmentTree;