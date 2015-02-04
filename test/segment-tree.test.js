var SegmentTree = require('../lib/segment-tree');

describe('SegmentTree', function () {
  describe('#build()', function () {
    var segmentTree = new SegmentTree();

    it('should throw if no intervals', function () {
      (function () {
        segmentTree.build();
      }).should.throw('There is no interval.');
    })
  })
})
