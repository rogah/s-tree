var should = require('should');

var Segment = require('../lib/segment');

describe('Segment', function () {

  describe('#start', function () {
    it('should throw if not provided', function () {
      (function () {
        new Segment();
      }).should.throw('Both #start and #end points are required.');
    });

    it('should throw if not a number', function () {
      (function () {
        new Segment('a', 10);
      }).should.throw('Both #start and #end points must be of type number.');
    });

    it('should throw if greater than #end', function () {
      (function () {
        new Segment(10, 5);
      }).should.throw('The #start should be smaller then #end point.');
    });

    it('should be a property', function () {
      new Segment(5, 10).should.have.property('start', 5);
    });
  });

  describe('#end', function () {
    it('should throw if not provided', function () {
      (function () {
        new Segment(5);
      }).should.throw('Both #start and #end points are required.');
    });

    it('should throw if not a number', function () {
      (function () {
        new Segment(5, 'a');
      }).should.throw('Both #start and #end points must be of type number.');
    });

    it('should throw if smaller than #start', function () {
      (function () {
        new Segment(10, 5);
      }).should.throw('The #start should be smaller then #end point.');
    });

    it('should be a property', function () {
      new Segment(5, 10).should.have.property('end', 10);
    });
  });

  describe('#compareTo()', function () {
    var segment = new Segment(5, 10);

    it('should return SUBSET if given segment is equal to endpoints', function () {
      var other = new Segment(5, 10);
      segment.compareTo(other).should.be.eql(Segment.SUBSET);
    });

    it('should return SUPERSET if given segment contains the endpoints', function () {
      var other = new Segment(6, 9);
      segment.compareTo(other).should.be.eql(Segment.SUPERSET);
    });

    it('should return SUBSET if endpoints are between given segment', function () {
      var other = new Segment(4, 11);
      segment.compareTo(other).should.be.eql(Segment.SUBSET);
    });

    it('should return INTERSECT if given segment starts between and ends after endpoints', function () {
      var other = new Segment(6, 11);
      segment.compareTo(other).should.be.eql(Segment.INTERSECT);
    });

    it('should return INTERSECT if given segment ends between and start before endpoints', function () {
      var other = new Segment(4, 9);
      segment.compareTo(other).should.be.eql(Segment.INTERSECT);
    });

    it('should return DISJOINT if given segment is before start endpoint', function () {
      var other = new Segment(0, 4);
      segment.compareTo(other).should.be.eql(Segment.DISJOINT);
    });

    it('should return DISJOINT if given segment is after end endpoint', function () {
      var other = new Segment(11, 15);
      segment.compareTo(other).should.be.eql(Segment.DISJOINT);
    });
  });

  describe('#overlapWith()', function () {
    var segment = new Segment(5, 10);

    describe('when including endpoints (default)', function () {

      it('should return true if #start is equal to #end point of both segments', function () {
        var point = new Segment(1, 1),
          other = new Segment(1, 1);
        point.overlapWith(other).should.be.true;
      });

      it('should return true if given segment is equal to endpoints', function () {
        var other = new Segment(5, 10);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment is a subset', function () {
        var other = new Segment(6, 9);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment is a superset', function () {
        var other = new Segment(4, 11);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment ends at the start point', function () {
        var other = new Segment(4, 5);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment starts at end point', function () {
        var other = new Segment(10, 11);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment starts at start point and ends after', function () {
        var other = new Segment(5, 11);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment ends at end pont and starts before', function () {
        var other = new Segment(4, 10);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment starts in between and ends after', function () {
        var other = new Segment(6, 11);
        segment.overlapWith(other).should.be.true;
      });

      it('should return true if given segment ends in between and starts before', function () {
        var other = new Segment(4, 9);
        segment.overlapWith(other).should.be.true;
      });

      it('should return false if given segment ends before start point', function () {
        var other = new Segment(3, 4);
        segment.overlapWith(other).should.be.false;
      });

      it('should return false if given segment starts after point', function () {
        var other = new Segment(11, 12);
        segment.overlapWith(other).should.be.false;
      });
    });

    describe('when excluding endpoints', function () {

      it('should return false if #start is equal to #end point of both segments', function () {
        var point = new Segment(1, 1),
          other = new Segment(1, 1);
        point.overlapWith(other, false).should.be.false;
      });

      it('should return true if given segment is equal to endpoints', function () {
        var other = new Segment(5, 10);
        segment.overlapWith(other, false).should.be.true;
      });

      it('should return true if given segment is a subset', function () {
        var other = new Segment(6, 9);
        segment.overlapWith(other, false).should.be.true;
      });

      it('should return true if given segment is a superset', function () {
        var other = new Segment(4, 11);
        segment.overlapWith(other, false).should.be.true;
      });

      it('should return false if given segment ends at the start point', function () {
        var other = new Segment(4, 5);
        segment.overlapWith(other, false).should.be.false;
      });

      it('should return false if given segment starts at end point', function () {
        var other = new Segment(10, 11);
        segment.overlapWith(other, false).should.be.false;
      });

      it('should return true if given segment starts at start point and ends after', function () {
        var other = new Segment(5, 11);
        segment.overlapWith(other, false).should.be.true;
      });

      it('should return true if given segment ends at end pont and starts before', function () {
        var other = new Segment(4, 10);
        segment.overlapWith(other, false).should.be.true;
      });

      it('should return true if given segment starts in between and ends after', function () {
        var other = new Segment(6, 11);
        segment.overlapWith(other, false).should.be.true;
      });

      it('should return true if given segment ends in between and starts before', function () {
        var other = new Segment(4, 9);
        segment.overlapWith(other, false).should.be.true;
      });

      it('should return false if given segment ends before start point', function () {
        var other = new Segment(3, 4);
        segment.overlapWith(other, false).should.be.false;
      });

      it('should return false if given segment starts after end point', function () {
        var other = new Segment(11, 12);
        segment.overlapWith(other, false).should.be.false;
      });
    });
  });

  describe('#isSubsetOf()', function () {
    var segment = new Segment(5, 10);

    it('should return true if a subset of given segment', function () {
      var other = new Segment(5, 10);
      segment.isSubsetOf(other).should.be.true;
    });

    it('should return false as a superset of given segment', function () {
      var other = new Segment(6, 9);
      segment.isSubsetOf(other).should.be.false;
    });

    it('should return false as a intersection of given segment', function () {
      var other = new Segment(6, 11);
      segment.isSubsetOf(other).should.be.false;
    });

    it('should return false as a disjoint of given segment', function () {
      var other = new Segment(2, 4);
      segment.isSubsetOf(other).should.be.false;
    });
  });

  describe('#isDisjointOf()', function () {
    var segment = new Segment(5, 10);

    it('should return false if a subset of given segment', function () {
      var other = new Segment(5, 10);
      segment.isDisjointOf(other).should.be.false;
    });

    it('should return false as a superset of given segment', function () {
      var other = new Segment(6, 9);
      segment.isDisjointOf(other).should.be.false;
    });

    it('should return false as a intersection of given segment', function () {
      var other = new Segment(2, 6);
      segment.isDisjointOf(other).should.be.false;
    });

    it('should return true as a disjoint of given segment', function () {
      var other = new Segment(2, 4);
      segment.isDisjointOf(other).should.be.true;
    });
  });
});
