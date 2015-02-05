var Segment = require('../lib/segment');

describe('Segment', function () {

  describe('#start', function () {
    it('should throw if not provided', function () {
      (function () {
        new Segment();
      }).should.throw('Both #start and #end points are required.');
    })

    it('should throw if not a number', function () {
      (function () {
        new Segment('a', 10);
      }).should.throw('Both #start and #end points must be of type number.');
    })

    it('should throw if greater than #end', function () {
      (function () {
        new Segment(10, 5);
      }).should.throw('The #start should be smaller then #end point.');
    })

    it('should be a property', function () {
      new Segment(5, 10).should.have.property('start', 5);
    })
  })

  describe('#end', function () {
    it('should throw if not provided', function () {
      (function () {
        new Segment(5);
      }).should.throw('Both #start and #end points are required.');
    })

    it('should throw if not a number', function () {
      (function () {
        new Segment(5, 'a');
      }).should.throw('Both #start and #end points must be of type number.');
    })

    it('should throw if smaller than #start', function () {
      (function () {
        new Segment(10, 5);
      }).should.throw('The #start should be smaller then #end point.');
    })

    it('should be a property', function () {
      new Segment(5, 10).should.have.property('end', 10);
    })
  })

  describe('#compareTo()', function () {
    var segment = new Segment(5, 10);

    it('should return SUBSET if given segment is equal to endpoints', function () {
      var other = new Segment(5, 10);
      segment.compareTo(other).should.be.eql(Segment.SUBSET);
    })

    it('should return SUPERSET if given segment contains the endpoints', function () {
      var other = new Segment(6, 9);
      segment.compareTo(other).should.be.eql(Segment.SUPERSET);
    })

    it('should return SUBSET if endpoints are between given segment', function () {
      var other = new Segment(4, 11);
      segment.compareTo(other).should.be.eql(Segment.SUBSET);
    })

    it('should return INTERSECT if given segment starts between and ends after endpoints', function () {
      var other = new Segment(6, 11);
      segment.compareTo(other).should.be.eql(Segment.INTERSECT);
    })

    it('should return INTERSECT if given segment ends between and start before endpoints', function () {
      var other = new Segment(4, 9);
      segment.compareTo(other).should.be.eql(Segment.INTERSECT);
    })

    it('should return DISJOINT if given segment is before start endpoint', function () {
      var other = new Segment(0, 4);
      segment.compareTo(other).should.be.eql(Segment.DISJOINT);
    })

    it('should return DISJOINT if given segment is after end endpoint', function () {
      var other = new Segment(11, 15);
      segment.compareTo(other).should.be.eql(Segment.DISJOINT);
    })
  })
  
})