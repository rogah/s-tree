var SegmentTree = require('../lib/segment-tree');

describe('SegmentTree', function () {
  describe('#push()', function () {
    var segmentTree;

    beforeEach(function () {
      segmentTree = new SegmentTree();
    });

    it('should throw if #start is not provided', function () {
      (function () {
        segmentTree.push();
      }).should.throw();
    })

    it('should throw if #end is not provided', function () {
      (function () {
        segmentTree.push(5);
      }).should.throw();
    })

    it('should not throw if #data is not provided', function () {
      (function () {
        segmentTree.push(5, 10);
      }).should.not.throw();
    })

    it('should accept #data is provided', function () {
      (function () {
        segmentTree.push(5, 10, 'foo');
      }).should.not.throw();
    })
  });

  // describe('#build()', function () {
  //   it('should throw if no intervals', function () {
  //     (function () {
  //       new SegmentTree().build();
  //     }).should.throw('There is no interval.');
  //   })
  // })

  describe('when querying', function () {
    var segmentTree = new SegmentTree();

    beforeEach(function() {
      segmentTree.clear();
      segmentTree.push(1, 1, 'a');
      segmentTree.push(2, 3, 'b');
      segmentTree.push(5, 7, 'c');
      segmentTree.push(4, 6, 'd');
      segmentTree.push(6, 9, 'e');
      segmentTree.push(9, 14, 'f');
      segmentTree.push(10, 13, 'g');
      segmentTree.push(11, 11, 'h');
      segmentTree.build();
    });

    describe('#queryInterval()', function () {
      it('should return correct number of intervals', function () {
        segmentTree.query({ start: 1, end: 2, concurrent: false }).should.equal(2);
        segmentTree.query({ start: [1], end: [2], concurrent: false }).should.equal(2);
        segmentTree.queryInterval(0, 0).should.equal(0);
        segmentTree.queryInterval(15, 25).should.equal(0);
        segmentTree.queryInterval(1, 2).should.equal(2);
        segmentTree.queryInterval(2.5, 3).should.equal(1);
        segmentTree.queryInterval(5, 6).should.equal(3);
        segmentTree.queryInterval(6.5, 11).should.equal(5);
      })

      // it('should return correct number of concurrences for given points', function () {
      //   segmentTree.queryInterval(5, 6, { concurrent: true }, function (data) {
      //     console.log(data);
      //   }).should.equal(2);
      // })
    })

    describe('#queryPoint()', function () {
      it('should return correct number of overlaps for a given point', function () {
        segmentTree.queryPoint(0).should.equal(0);
        segmentTree.queryPoint(15).should.equal(0);
        segmentTree.queryPoint(1).should.equal(1);
        segmentTree.queryPoint(2).should.equal(1);
        segmentTree.queryPoint(3).should.equal(1);
        segmentTree.queryPoint(2.5).should.equal(1);
        segmentTree.queryPoint(5).should.equal(2);
        segmentTree.queryPoint(6).should.equal(3);
        segmentTree.queryPoint(6.5).should.equal(2);
        segmentTree.queryPoint(11).should.equal(3);
      })
    })

    describe('#queryPoints()', function () {
      it('should return correct number of overlaps for given points', function () {
        segmentTree.queryPoints([0]).should.equal(0);
        segmentTree.queryPoints([0, 15]).should.equal(0);
        segmentTree.queryPoints([1, 2, 3]).should.equal(2);
        segmentTree.queryPoints([2, 2.5, 3]).should.equal(1);
        segmentTree.queryPoints([5, 6]).should.equal(3);
        segmentTree.queryPoints([6, 6.5]).should.equal(3);
        segmentTree.queryPoints([6, 5, 4, 3]).should.equal(4);
        segmentTree.queryPoints([11, 11.5]).should.equal(3);
      })
    })

    // describe('#queryConcurrencies()', function () {
    //   it('should return correct number of overlaps for given points', function () {
    //     segmentTree.queryInterval(10, 13, function (data, occ) {
    //       console.log(occ);
    //     }).should.equal(2);
    //   })
    // })
  })
})
