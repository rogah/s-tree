var should = require('should'), 
  sinon = require('sinon');

var SegmentTree = require('../lib/segment-tree');

describe('SegmentTree', function () {

  it('should implement EventEmitter', function () {
    new SegmentTree().should.be.an.instanceOf(require('events').EventEmitter);
  });

  describe('#hasIntervals()', function () {
    it('should return false if no interval added', function () {
      new SegmentTree().hasIntervals().should.be.false;
    });

    it('should return true if there is at least one interval', function () {
      new SegmentTree().push(5, 10).hasIntervals().should.be.true;
    });
  });

  describe('#push()', function () {
    var segmentTree,
      eventSpy;

    beforeEach(function () {
      eventSpy = sinon.spy();
      segmentTree = new SegmentTree();
      segmentTree.on('pushed', eventSpy);
      segmentTree.on('error', eventSpy);
    });

    it('should emit "error" event if #start is not provided', function () {
      segmentTree.push();
      eventSpy.called.should.be.true;
      eventSpy.getCall(0).args[0].should.be.a.Error;
    });

    it('should throw if #end is not provided', function () {
      segmentTree.push(5);
      eventSpy.called.should.be.true;
      eventSpy.getCall(0).args[0].should.be.a.Error;
    });

    it('should not throw if #data is not provided', function () {
      segmentTree.push(5, 10);
      eventSpy.called.should.be.true;
      should.not.exist(eventSpy.getCall(0).args[0].data);
    });

    it('should accept #data is provided', function () {
      segmentTree.push(5, 10, 'foo');
      eventSpy.called.should.be.true;
      eventSpy.getCall(0).args[0].data.should.be.eql('foo');
    });

    it('should return the object itself', function () {
      segmentTree.push(5, 10, 'foo').should.be.eql(segmentTree);
    });

    it('should emit a "pushed" event passing arguments through callback', function () {
      segmentTree.push(5, 10, 'foo');
      eventSpy.calledWithExactly({ 
        start: 5, 
        end: 10, 
        data: 'foo' 
      }).should.be.true;
    });
  });

  describe('#clear()', function () {
    var segmentTree = new SegmentTree().push(5, 10, 'foo');

    it('should return the object itself', function () {
      segmentTree.clear().should.be.eql(segmentTree);
    });

    it('should clear all intervals', function () {
      segmentTree.clear().hasIntervals().should.be.false;
    });

    it('should emit a "clean" event', function () {
      var eventSpy = sinon.spy();
      segmentTree.on('clean', eventSpy);
      segmentTree.clear();
      eventSpy.called.should.be.true;
    });
  });

  describe('#build()', function () {
    it('should throw if no intervals pushed into the tree', function () {
      (function () {
        new SegmentTree().build();
      }).should.throw('There is no interval available.');
    });

    it('should return the object itself', function () {
      var segmentTree = new SegmentTree()
        .push(5, 10, 'foo');
      segmentTree.build().should.be.eql(segmentTree);
    });
  });

  describe('#isBuilt()', function () {

    it('should return false before tree being built', function () {
      new SegmentTree().isBuilt().should.false;
    });

    it('should return true after tree has been called', function () {
      new SegmentTree().push(5, 10, 'foo').build().isBuilt().should.true;
    });
  });

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

    before(function () {
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
        .push(12, 15, 'i')
        .build();
    });

    it('should throw if no #options object is provided', function () {
      (function () {
        segmentTree.query();
      }).should.throw('Options should be provided.');
    });

    it('should throw if empty #options object is provided', function () {
      (function () {
        segmentTree.query({}, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should throw if #options.start argument is missing', function () {
      (function () {
        segmentTree.query({
          end: 10
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should throw if #options.start argument is of a different type then Number', function () {
      (function () {
        segmentTree.query({
          start: '5',
          end: 10
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should not throw if #options.start argument is of type then Array', function () {
      (function () {
        segmentTree.query({
          start: [5],
          end: [10]
        }, callbackStub);
      }).should.not.throw();
    });

    it('should not throw if #callback() is not provided', function () {
      (function () {
        segmentTree.query({
          start: [5],
          end: [10]
        });
      }).should.not.throw();
    });

    it('should throw if #options.end argument is missing', function () {
      (function () {
        segmentTree.query({
          start: 5
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should throw if #options.end argument is of a different type then Numbe', function () {
      (function () {
        segmentTree.query({
          start: 5,
          end: '10'
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should not throw if #options.concurrency is missing', function () {
      (function () {
        segmentTree.query({
          start: 5,
          end: 10
        }, callbackStub);
      }).should.not.throw();
    });

    it('should throw if #options.concurrency is of a different type then Boolean', function () {
      (function () {
        segmentTree.query({
          start: 5,
          end: 10,
          concurrency: 'a'
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should throw if only #options.concurrency is provided', function () {
      (function () {
        segmentTree.query({
          concurrency: true
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should not throw if #options.endpoints is missing', function () {
      (function () {
        segmentTree.query({
          start: 5,
          end: 10
        }, callbackStub);
      }).should.not.throw();
    });

    it('should throw if #options.endpoints is of a different type then Boolean', function () {
      (function () {
        segmentTree.query({
          start: 5,
          end: 10,
          endpoints: 'a'
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should throw if only #options.endpoints is provided', function () {
      (function () {
        segmentTree.query({
          endpoints: false
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should throw if #options.point is of different type then Number', function () {
      (function () {
        segmentTree.query({
          point: []
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should not throw if #options.point is provided', function () {
      (function () {
        segmentTree.query({
          point: 1
        }, callbackStub);
      }).should.not.throw();
    });

    it('should throw if #options.points is of different type then Array', function () {
      (function () {
        segmentTree.query({
          points: 5
        }, callbackStub);
      }).should.throw('The options provided are invalid to query intervals.');
    });

    it('should not throw if #options.points is provided', function () {
      (function () {
        segmentTree.query({
          points: [5]
        }, callbackStub);
      }).should.not.throw();
    });

    describe('when querying overlaps for (start, end)', function () {

      describe('including endpoints', function () {

        it('should return none on (0, 0) for given hasIntervals', function () {
          segmentTree.query({
            start: 0,
            end: 0
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return 1 on (1, 1) for given intervals', function () {
          segmentTree.query({
            start: 1,
            end: 1
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return none on (1.1, 1.9) for given intervals', function () {
          segmentTree.query({
            start: 1.1,
            end: 1.9
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return 2 on (1, 2) for given intervals', function () {
          segmentTree.query({
            start: 1,
            end: 2
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 2 on (2, 4) for given intervals', function () {
          segmentTree.query({
            start: 2,
            end: 4
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on (5.5, 6.5) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 6.5
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 5 on (5.5, 10.5) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 10.5
          }, function (intervals) {
            intervals.length.should.be.eql(5);
          });
        });

        it('should return 6 on (5.5, 11) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 11
          }, function (intervals) {
            intervals.length.should.be.eql(6);
          });
        });

        it('should return 1 on (14, 14) for given intervals', function () {
          segmentTree.query({
            start: 14,
            end: 14
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on (0, 0) for given hasIntervals', function () {
          segmentTree.query({
            start: 0,
            end: 0,
            endpoints: false
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return none on (1, 1) for given intervals', function () {
          segmentTree.query({
            start: 1,
            end: 1,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(0);
          });
        });

        it('should return none on (1.1, 1.9) for given intervals', function () {
          segmentTree.query({
            start: 1.1,
            end: 1.9,
            endpoints: false
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return none on (1, 2) for given intervals', function () {
          segmentTree.query({
            start: 1,
            end: 2,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 1 on (2, 4) for given intervals', function () {
          segmentTree.query({
            start: 2,
            end: 4,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 3 on (5.5, 6.5) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 6.5,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 5 on (5.5, 10.5) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 10.5,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(5);
          });
        });

        it('should return 5 on (5.5, 11) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 11,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(5);
          });
        });

        it('should return 4 on (14, 14) for given intervals', function () {
          segmentTree.query({
            start: 14,
            end: 14,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });
      });
    });

    describe('when querying concurrences for (start, end)', function () {

      describe('including endpoints', function () {

        it('should return none on (0,0) for given intervals', function () {
          segmentTree.query({
            start: 0,
            end: 0,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (1,1) for given intervals', function () {
          segmentTree.query({
            start: 1,
            end: 1,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 1 on (4,5) for given intervals', function () {
          segmentTree.query({
            start: 4,
            end: 5,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 3 on (5.5,6) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 6,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 2 on (5,6) for given intervals', function () {
          segmentTree.query({
            start: 5,
            end: 6,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 2 on (6,7) for given intervals', function () {
          segmentTree.query({
            start: 6,
            end: 7,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 1 on (9,12) for given intervals', function () {
          segmentTree.query({
            start: 9,
            end: 12,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 2 on (10,13) for given intervals', function () {
          segmentTree.query({
            start: 10,
            end: 13,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on (12,13) for given intervals', function () {
          segmentTree.query({
            start: 12,
            end: 13,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on (0,0) for given intervals', function () {
          segmentTree.query({
            start: 0,
            end: 0,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (1,1) for given intervals', function () {
          segmentTree.query({
            start: 1,
            end: 1,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 1 on (4,5) for given intervals', function () {
          segmentTree.query({
            start: 4,
            end: 5,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 3 on (5.5,6) for given intervals', function () {
          segmentTree.query({
            start: 5.5,
            end: 6,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 2 on (5,6) for given intervals', function () {
          segmentTree.query({
            start: 5,
            end: 6,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 2 on (6,7) for given intervals', function () {
          segmentTree.query({
            start: 6,
            end: 7,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 1 on (9,12) for given intervals', function () {
          segmentTree.query({
            start: 9,
            end: 12,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 2 on (10,13) for given intervals', function () {
          segmentTree.query({
            start: 10,
            end: 13,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on (12,13) for given intervals', function () {
          segmentTree.query({
            start: 12,
            end: 13,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });
      });
    });

    describe('when querying overlaps for ([start], [end])', function () {

      describe('including endpoints', function () {

        it('should return none on ([0, 1.1, 3.1], [0.9, 1.9, 3.4]) for given hasIntervals', function () {
          segmentTree.query({
            start: [0, 1.1, 3.1],
            end: [0.9, 1.9, 3.4]
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return 2 on ([1, 2], [1, 3]) for given hasIntervals', function () {
          segmentTree.query({
            start: [1, 2],
            end: [1, 3]
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 4 on ([4, 6, 8], [6, 7, 9]) for given hasIntervals', function () {
          segmentTree.query({
            start: [4, 6, 8],
            end: [6, 7, 9]
          }, function (intervals) {
            intervals.length.should.be.eql(4);
          });
        });

        it('should return 8 on ([2.5, 11, 14], [5.5, 13, 15]) for given hasIntervals', function () {
          segmentTree.query({
            start: [2.5, 11, 14],
            end: [5.5, 13, 15]
          }, function (intervals) {
            intervals.length.should.be.eql(8);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on ([0, 1.1, 3.1], [0.9, 1.9, 3.4]) for given hasIntervals', function () {
          segmentTree.query({
            start: [0, 1.1, 3.1],
            end: [0.9, 1.9, 3.4],
            endpoints: false
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return 1 on ([1, 2], [1, 3]) for given hasIntervals', function () {
          segmentTree.query({
            start: [1, 2],
            end: [1, 3],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 3 on ([4, 6, 8], [6, 7, 9]) for given hasIntervals', function () {
          segmentTree.query({
            start: [4, 6, 8],
            end: [6, 7, 9],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 6 on ([2.5, 11, 14], [5.5, 13, 15]) for given hasIntervals', function () {
          segmentTree.query({
            start: [2.5, 11, 14],
            end: [5.5, 13, 15],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(6);
          });
        });
      });
    });

    describe('when querying concurrences for ([start], [end])', function () {

      describe('including endpoints', function () {

        it('should return none on ([0, 1.1, 3.1], [0.9, 1.9, 3.4]) for given hasIntervals', function () {
          segmentTree.query({
            start: [0, 1.1, 3.1],
            end: [0.9, 1.9, 3.4],
            concurrency: true
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return 2 on ([1, 2], [1, 3]) for given hasIntervals', function () {
          segmentTree.query({
            start: [1, 2],
            end: [1, 3],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on ([4, 6, 8], [6, 7, 9]) for given hasIntervals', function () {
          segmentTree.query({
            start: [4, 6, 8],
            end: [6, 7, 9],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 3 on ([2.5, 11, 14], [5.5, 13, 15]) for given hasIntervals', function () {
          segmentTree.query({
            start: [2.5, 11, 14],
            end: [5.5, 13, 15],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on ([0, 1.1, 3.1], [0.9, 1.9, 3.4]) for given hasIntervals', function () {
          segmentTree.query({
            start: [0, 1.1, 3.1],
            end: [0.9, 1.9, 3.4],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.should.be.empty;
          });
        });

        it('should return 1 on ([1, 2], [1, 3]) for given hasIntervals', function () {
          segmentTree.query({
            start: [1, 2],
            end: [1, 3],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 3 on ([4, 6, 8], [6, 7, 9]) for given hasIntervals', function () {
          segmentTree.query({
            start: [4, 6, 8],
            end: [6, 7, 9],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 3 on ([2.5, 11, 14], [5.5, 13, 15]) for given hasIntervals', function () {
          segmentTree.query({
            start: [2.5, 11, 14],
            end: [5.5, 13, 15],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });
      });
    });

    describe('when querying overlaps for (point)', function () {

      describe('including endpoints', function () {

        it('should return none on (0) for given intervals', function () {
          segmentTree.query({
            point: 0
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 1 on (1) for given intervals', function () {
          segmentTree.query({
            point: 1
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 1 on (2) for given intervals', function () {
          segmentTree.query({
            point: 2
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 3 on (6) for given intervals', function () {
          segmentTree.query({
            point: 6
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 2 on (9) for given intervals', function () {
          segmentTree.query({
            point: 9
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on (11) for given intervals', function () {
          segmentTree.query({
            point: 11
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on (0) for given intervals', function () {
          segmentTree.query({
            point: 0,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (1) for given intervals', function () {
          segmentTree.query({
            point: 1,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (1.1) for given intervals', function () {
          segmentTree.query({
            point: 1.1,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (2) for given intervals', function () {
          segmentTree.query({
            point: 2,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 1 on (2.1) for given intervals', function () {
          segmentTree.query({
            point: 2.1,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 2 on (6) for given intervals', function () {
          segmentTree.query({
            point: 6,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return none on (9) for given intervals', function () {
          segmentTree.query({
            point: 9,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 2 on (11) for given intervals', function () {
          segmentTree.query({
            point: 11,
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });
      });
    });

    describe('when querying concurrences for (point)', function () {

      describe('including endpoints', function () {

        it('should return none on (0) for given intervals', function () {
          segmentTree.query({
            point: 0,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 1 on (1) for given intervals', function () {
          segmentTree.query({
            point: 1,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 1 on (2) for given intervals', function () {
          segmentTree.query({
            point: 2,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 3 on (6) for given intervals', function () {
          segmentTree.query({
            point: 6,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 2 on (9) for given intervals', function () {
          segmentTree.query({
            point: 9,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on (11) for given intervals', function () {
          segmentTree.query({
            point: 11,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on (0) for given intervals', function () {
          segmentTree.query({
            point: 0,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (1) for given intervals', function () {
          segmentTree.query({
            point: 1,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (1.1) for given intervals', function () {
          segmentTree.query({
            point: 1.1,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on (2) for given intervals', function () {
          segmentTree.query({
            point: 2,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 1 on (2.1) for given intervals', function () {
          segmentTree.query({
            point: 2.1,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(1);
          });
        });

        it('should return 2 on (6) for given intervals', function () {
          segmentTree.query({
            point: 6,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return none on (9) for given intervals', function () {
          segmentTree.query({
            point: 9,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 2 on (11) for given intervals', function () {
          segmentTree.query({
            point: 11,
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });
      });
    });

    describe('when querying overlaps for ([point])', function () {

      describe('including endpoints', function () {

        it('should return none on ([0]) for given intervals', function () {
          segmentTree.query({
            points: [0]
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on ([0, 3.5]) for given intervals', function () {
          segmentTree.query({
            points: [0, 3.5]
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 2 on ([1, 2, 3]) for given intervals', function () {
          segmentTree.query({
            points: [1, 2, 3]
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on ([6]) for given intervals', function () {
          segmentTree.query({
            points: [6]
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 3 on ([11]) for given intervals', function () {
          segmentTree.query({
            points: [11]
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 5 on ([6, 9, 14]) for given intervals', function () {
          segmentTree.query({
            points: [6, 9, 14]
          }, function (intervals) {
            intervals.length.should.be.eql(5);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on ([0]) for given intervals', function () {
          segmentTree.query({
            points: [0],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on ([0, 3.5]) for given intervals', function () {
          segmentTree.query({
            points: [0, 3.5],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 0 on ([1, 2, 3]) for given intervals', function () {
          segmentTree.query({
            points: [1, 2, 3],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 2 on ([6]) for given intervals', function () {
          segmentTree.query({
            points: [6],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 2 on ([11]) for given intervals', function () {
          segmentTree.query({
            points: [11],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 2 on ([6, 9, 14]) for given intervals', function () {
          segmentTree.query({
            points: [6, 9, 14],
            endpoints: false
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });
      });
    });

    describe('when querying concurrences for ([point])', function () {

      describe('including endpoints', function () {

        it('should return none on ([0]) for given intervals', function () {
          segmentTree.query({
            points: [0],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on ([0, 3.5]) for given intervals', function () {
          segmentTree.query({
            points: [0, 3.5],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 2 on ([1, 2, 3]) for given intervals', function () {
          segmentTree.query({
            points: [1, 2, 3],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 3 on ([6]) for given intervals', function () {
          segmentTree.query({
            points: [6],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 3 on ([11]) for given intervals', function () {
          segmentTree.query({
            points: [11],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(3);
          });
        });

        it('should return 5 on ([6, 9, 14]) for given intervals', function () {
          segmentTree.query({
            points: [6, 9, 14],
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(5);
          });
        });
      });

      describe('excluding endpoints', function () {

        it('should return none on ([0]) for given intervals', function () {
          segmentTree.query({
            points: [0],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return none on ([0, 3.5]) for given intervals', function () {
          segmentTree.query({
            points: [0, 3.5],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 0 on ([1, 2, 3]) for given intervals', function () {
          segmentTree.query({
            points: [1, 2, 3],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.empty;
          });
        });

        it('should return 2 on ([6]) for given intervals', function () {
          segmentTree.query({
            points: [6],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 2 on ([11]) for given intervals', function () {
          segmentTree.query({
            points: [11],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });

        it('should return 2 on ([6, 9, 14]) for given intervals', function () {
          segmentTree.query({
            points: [6, 9, 14],
            endpoints: false,
            concurrency: true
          }, function (intervals) {
            intervals.length.should.be.eql(2);
          });
        });
      });
    });
  });
});