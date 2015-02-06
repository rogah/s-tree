var SegmentTree = require('../lib/segment-tree');

describe('SegmentTree', function () {

  describe('#hasIntervals()', function () {
    it('should return false if no interval added', function () {
      new SegmentTree().hasIntervals().should.be.false;
    })

    it('should return true if there is at least one interval', function () {
      new SegmentTree().push(5, 10).hasIntervals().should.be.true;
    })
  })

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

    it('should return the object itself', function () {
      segmentTree.push(5, 10, 'foo').should.be.eql(segmentTree);
    })
  })

  describe('#clear()', function () {
    it('should return the object itself', function () {
      var segmentTree = new SegmentTree().push(5, 10, 'foo');
      segmentTree.clear().should.be.eql(segmentTree);
    })

    it('should return the object itself', function () {
      var segmentTree = new SegmentTree();
      segmentTree.clear().should.be.eql(segmentTree);
    })
  })

  describe('#build()', function () {
    it('should throw if no intervals pushed into the tree', function () {
      (function () {
        new SegmentTree().build();
      }).should.throw('There is no interval available.');
    })

    it('should return the object itself', function () {
      var segmentTree = new SegmentTree()
        .push(5, 10, 'foo');
      segmentTree.build().should.be.eql(segmentTree);
    })
  })

  describe('#query()', function () {

    /*------------------------------------------------------------------------------------------*
    |  01    02    03    04    05    06    07    08    09    10    11    12    13    14    15   |
    |-------------------------------------------------------------------------------------------|                                                                                           |  
    |  oa>   o--b-->           o-----c----->           o-------------f--------------->          |
    |                    0-----d----->                       o--------g-------->                |
    |                              ----------e-------->           oh>    o---------i-------->   |
    *------------------------------------------------------------------------------------------*/

    var segmentTree = new SegmentTree(),
      callbackStub = function () {};

    before(function() {
      segmentTree
        .clear()
          .push(1, 1, 'a')
          .push(2, 3, 'b')
          .push(5, 7, 'c')
          .push(4, 6, 'd')
          .push(5.5, 9, 'e')
          .push(9, 14, 'f')
          .push(10, 13, 'g')
          .push(11, 11, 'h')
          .push(12, 15, 'h')
        .build();
    })

    it('should throw if no #options object is provided', function () {
      (function () {
        segmentTree.query();
      }).should.throw('Options should be provided.');
    })

    it('should throw if empty #options object is provided', function () {
      (function () {
        segmentTree.query({}, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should throw if #options.start argument is missing', function () {
      (function () {
        segmentTree.query({ end: 10 }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should throw if #options.start argument is of a different type then Number', function () {
      (function () {
        segmentTree.query({ start: '5', end: 10 }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should not throw if #options.start argument is of type then Array', function () {
      (function () {
        segmentTree.query({ start: [ 5 ], end:[ 10 ] }, callbackStub);
      }).should.not.throw();
    })

    it('should throw if #options.end argument is missing', function () {
      (function () {
        segmentTree.query({ start: 5 }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should throw if #options.end argument is of a different type then Numbe', function () {
      (function () {
        segmentTree.query({ start: 5, end: '10' }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should not throw if #options.concurrency is missing', function () {
      (function () {
        segmentTree.query({ start: 5, end: 10 }, callbackStub);
      }).should.not.throw();
    })

    it('should throw if #options.concurrency is of a different type then Boolean', function () {
      (function () {
        segmentTree.query({ start: 5, end: 10, concurrency: 'a' }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should throw if only #options.concurrency is provided', function () {
      (function () {
        segmentTree.query({ concurrency: true }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should throw if #options.point is of different type then Number', function () {
      (function () {
        segmentTree.query({ point: [] }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    it('should throw if #options.points is of different type then Array', function () {
      (function () {
        segmentTree.query({ points: 5 }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    })

    describe('when querying overlaps for (start, end)', function () {

      describe('including endpoints', function () {

        it('should return none on (0, 0) for given hasIntervals', function () {
          segmentTree.query({ start: 0, end: 0 }, function (interals) {
            interals.should.be.empty;
          })
        })

        it('should return 1 on (1, 1) for given intervals', function () {
          segmentTree.query({ start: 1, end: 1 }, function (interals) {
           interals.length.should.be.eql(1);
          })
        })

        it('should return none on (1.1, 1.9) for given intervals', function () {
          segmentTree.query({ start: 1.1, end: 1.9 }, function (interals) {
            interals.should.be.empty;
          })
        })

        it('should return 2 on (1, 2) for given intervals', function () {
          segmentTree.query({ start: 1, end: 2 }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 2 on (2, 4) for given intervals', function () {
          segmentTree.query({ start: 2, end: 4 }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 3 on (5.5, 6.5) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 6.5 }, function (interals) {
            interals.length.should.be.eql(3);
          })
        })

        it('should return 5 on (5.5, 10.5) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 10.5 }, function (interals) {
            interals.length.should.be.eql(5);
          })
        })

        it('should return 6 on (5.5, 11) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 11 }, function (interals) {
            interals.length.should.be.eql(6);
          })
        })

        it('should return 1 on (14, 14) for given intervals', function () {
          segmentTree.query({ start: 14, end: 14 }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })
      })

      describe('excluding endpoints', function () {

        it('should return none on (0, 0) for given hasIntervals', function () {
          segmentTree.query({ start: 0, end: 0, endpoints: false }, function (interals) {
            interals.should.be.empty;
          })
        })

        it('should return none on (1, 1) for given intervals', function () {
          segmentTree.query({ start: 1, end: 1, endpoints: false }, function (interals) {
           interals.length.should.be.eql(0);
          })
        })

        it('should return none on (1.1, 1.9) for given intervals', function () {
          segmentTree.query({ start: 1.1, end: 1.9, endpoints: false }, function (interals) {
            interals.should.be.empty;
          })
        })

        it('should return none on (1, 2) for given intervals', function () {
          segmentTree.query({ start: 1, end: 2, endpoints: false }, function (interals) {
            interals.length.should.be.empty;
          })
        })

        it('should return 1 on (2, 4) for given intervals', function () {
          segmentTree.query({ start: 2, end: 4, endpoints: false }, function (interals) {
            interals.length.should.be.eql(1);
          })
        })

        it('should return 3 on (5.5, 6.5) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 6.5, endpoints: false }, function (interals) {
            interals.length.should.be.eql(3);
          })
        })

        it('should return 5 on (5.5, 10.5) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 10.5, endpoints: false }, function (interals) {
            interals.length.should.be.eql(5);
          })
        })

        it('should return 5 on (5.5, 11) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 11, endpoints: false }, function (interals) {
            interals.length.should.be.eql(5);
          })
        })

        it('should return 4 on (14, 14) for given intervals', function () {
          segmentTree.query({ start: 14, end: 14, endpoints: false }, function (interals) {
            interals.length.should.be.empty;
          })
        })
      })
    })

    /*------------------------------------------------------------------------------------------*
    |  01    02    03    04    05    06    07    08    09    10    11    12    13    14    15   |
    |-------------------------------------------------------------------------------------------|                                                                                           |  
    |  oa>   o--b-->           o-----c----->           o-------------f--------------->          |
    |                    0-----d----->                       o--------g-------->                |
    |                              ----------e-------->           oh>    o---------i-------->   |
    *------------------------------------------------------------------------------------------*/

    describe('when querying concurrences for (start, end)', function () {

      describe('including endpoints', function () {

        it('should return none on (0,0) for given intervals', function () {
          segmentTree.query({ start: 0, end: 0, concurrency: true }, function (interals) {
            interals.length.should.be.empty;
          })
        })

        it('should return none on (1,1) for given intervals', function () {
          segmentTree.query({ start: 1, end: 1, concurrency: true }, function (interals) {
            interals.length.should.be.empty;
          })
        })

        it('should return 1 on (4,5) for given intervals', function () {
          segmentTree.query({ start: 4, end: 5, concurrency: true }, function (interals) {
            interals.length.should.be.eql(1);
          })
        })

        it('should return 3 on (5.5,6) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 6, concurrency: true }, function (interals) {
            interals.length.should.be.eql(3);
          })
        })

        it('should return 2 on (5,6) for given intervals', function () {
          segmentTree.query({ start: 5, end: 6, concurrency: true }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 2 on (6,7) for given intervals', function () {
          segmentTree.query({ start: 6, end: 7, concurrency: true }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 1 on (9,12) for given intervals', function () {
          segmentTree.query({ start: 9, end: 12, concurrency: true }, function (interals) {
            interals.length.should.be.eql(1);
          })
        })

        it('should return 2 on (10,13) for given intervals', function () {
          segmentTree.query({ start: 10, end: 13, concurrency: true }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 3 on (12,13) for given intervals', function () {
          segmentTree.query({ start: 12, end: 13, concurrency: true }, function (interals) {
            interals.length.should.be.eql(3);
          })
        })
      })

      describe('excluding endpoints', function () {

        it('should return none on (0,0) for given intervals', function () {
          segmentTree.query({ start: 0, end: 0, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.empty;
          })
        })

        it('should return none on (1,1) for given intervals', function () {
          segmentTree.query({ start: 1, end: 1, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.empty;
          })
        })

        it('should return 1 on (4,5) for given intervals', function () {
          segmentTree.query({ start: 4, end: 5, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.eql(1);
          })
        })

        it('should return 3 on (5.5,6) for given intervals', function () {
          segmentTree.query({ start: 5.5, end: 6, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.eql(3);
          })
        })

        it('should return 2 on (5,6) for given intervals', function () {
          segmentTree.query({ start: 5, end: 6, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 2 on (6,7) for given intervals', function () {
          segmentTree.query({ start: 6, end: 7, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 1 on (9,12) for given intervals', function () {
          segmentTree.query({ start: 9, end: 12, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.eql(1);
          })
        })

        it('should return 2 on (10,13) for given intervals', function () {
          segmentTree.query({ start: 10, end: 13, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.eql(2);
          })
        })

        it('should return 3 on (12,13) for given intervals', function () {
          segmentTree.query({ start: 12, end: 13, endpoints: false, concurrency: true }, function (interals) {
            interals.length.should.be.eql(3);
          })
        })
      })
    })

    describe('when querying overlaps for point', function () {

      
    })

    //#################

  //   it('should return correct number of intervals', function () {
  //     segmentTree.query({ start: 0, end: 0 }).should.equal(0);
  //     segmentTree.query({ start: 15, end: 25 }).should.equal(0);
  //     segmentTree.query({ start: 1, end: 2 }).should.equal(2);
  //     segmentTree.query({ start: 2.5, end: 3 }).should.equal(1);
  //     segmentTree.query({ start: 5, end: 6 }).should.equal(3);
  //     segmentTree.query({ start: 6.5, end: 11 }).should.equal(5);
  //   })

  //   it('should return correct number of concurrences for given points', function () {
  //     segmentTree.query({ start: 5, end: 6, concurrency: true }, function (data) {
  //       //console.log(data);
  //     }).should.equal(2);
  //   })
  // })

  // describe('#queryPoint()', function () {
  //   it('should return correct number of overlaps for a given point', function () {
  //     segmentTree.query({ point: 0 }).should.equal(0);
  //     segmentTree.query({ point: 15 }).should.equal(0);
  //     segmentTree.query({ point: 1 }).should.equal(1);
  //     segmentTree.query({ point: 2 }).should.equal(1);
  //     segmentTree.query({ point: 3 }).should.equal(1);
  //     segmentTree.query({ point: 2.5 }).should.equal(1);
  //     segmentTree.query({ point: 5 }).should.equal(2);
  //     segmentTree.query({ point: 6 }).should.equal(3);
  //     segmentTree.query({ point: 6.5 }).should.equal(2);
  //     segmentTree.query({ point: 11 }).should.equal(3);
  //   })
  // })

  // describe('#queryPoints()', function () {
  //   it('should return correct number of overlaps for given points', function () {
  //     segmentTree.query({ points: [0] }).should.equal(0);
  //     segmentTree.query({ points: [0, 15] }).should.equal(0);
  //     segmentTree.query({ points: [1, 2, 3] }).should.equal(2);
  //     segmentTree.query({ points: [2, 2.5, 3] }).should.equal(1);
  //     segmentTree.query({ points: [5, 6] }).should.equal(3);
  //     segmentTree.query({ points: [6, 6.5] }).should.equal(3);
  //     segmentTree.query({ points: [6, 5, 4, 3] }).should.equal(4);
  //     segmentTree.query({ points: [11, 11.5] }).should.equal(3);
  //   })
  })
})
