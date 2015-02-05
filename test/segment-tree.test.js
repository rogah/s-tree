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

  describe('#build()', function () {
    it('should throw if no intervals', function () {
      (function () {
        new SegmentTree().build();
      }).should.throw('There is no interval.');
    })
  })

  /*------------------------------------------------------------------------------------------*
  |  01    02    03    04    05    06    07    08    09    10    11    12    13    14    15   |
  |-------------------------------------------------------------------------------------------|                                                                                           |  
  |  oa>   o--b-->           o-----c----->           o-------------f--------------->          |
  |                    0-----d----->                       o--------g-------->                |
  |                                 o--------e------->           oh>                          |
  *------------------------------------------------------------------------------------------*/

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
        segmentTree.query({ start: 0, end: 0 }).should.equal(0);
        segmentTree.query({ start: 15, end: 25 }).should.equal(0);
        segmentTree.query({ start: 1, end: 2 }).should.equal(2);
        segmentTree.query({ start: 2.5, end: 3 }).should.equal(1);
        segmentTree.query({ start: 5, end: 6 }).should.equal(3);
        segmentTree.query({ start: 6.5, end: 11 }).should.equal(5);
      })

      it('should return correct number of concurrences for given points', function () {
        segmentTree.query({ start: 5, end: 6, concurrency: true }, function (data) {
          //console.log(data);
        }).should.equal(2);
      })
    })

    describe('#queryPoint()', function () {
      it('should return correct number of overlaps for a given point', function () {
        segmentTree.query({ point: 0 }).should.equal(0);
        segmentTree.query({ point: 15 }).should.equal(0);
        segmentTree.query({ point: 1 }).should.equal(1);
        segmentTree.query({ point: 2 }).should.equal(1);
        segmentTree.query({ point: 3 }).should.equal(1);
        segmentTree.query({ point: 2.5 }).should.equal(1);
        segmentTree.query({ point: 5 }).should.equal(2);
        segmentTree.query({ point: 6 }).should.equal(3);
        segmentTree.query({ point: 6.5 }).should.equal(2);
        segmentTree.query({ point: 11 }).should.equal(3);
      })
    })

    describe('#queryPoints()', function () {
      it('should return correct number of overlaps for given points', function () {
        segmentTree.query({ points: [0] }).should.equal(0);
        segmentTree.query({ points: [0, 15] }).should.equal(0);
        segmentTree.query({ points: [1, 2, 3] }).should.equal(2);
        segmentTree.query({ points: [2, 2.5, 3] }).should.equal(1);
        segmentTree.query({ points: [5, 6] }).should.equal(3);
        segmentTree.query({ points: [6, 6.5] }).should.equal(3);
        segmentTree.query({ points: [6, 5, 4, 3] }).should.equal(4);
        segmentTree.query({ points: [11, 11.5] }).should.equal(3);
      })
    })
  })
})
