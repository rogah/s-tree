var SegmentTree = require('./segment-tree');

module.exports = function (callback) {

  var segmentTree = new SegmentTree();

  callback({

    hasIntervals: function () {
      return segmentTree.hasIntervals();
    },

    push: function (start, end, data) {
      segmentTree.push(start, end, data);
      return this;
    },

    clear: function () {
      segmentTree.clear();
      return this;
    },

    build: function () {
      segmentTree.build();
      return this;
    },

    isBuilt: function () {
      return segmentTree.isBuilt();
    },

    query: function (options, queryCallback) {
      return segmentTree.query(options, queryCallback);
    }

  });
};
