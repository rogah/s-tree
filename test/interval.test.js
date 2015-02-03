var Interval = require('../lib/interval');

describe('Interval', function () {

  describe('#id', function () {
    it('should be a property', function () {
      new Interval(5, 10).should.have.property('id');
    })

    it('should be a property of type number', function () {
      new Interval(5, 10).id.should.be.type('number');
    })
  })

  describe('#start', function () {
    it('should throw if not provided', function () {
      (function () {
        new Interval();
      }).should.throw('The interval endpoints are required.');
    })

    it('should throw if not a number', function () {
      (function () {
        new Interval('a', 10);
      }).should.throw('The interval endpoints must be of type number.');
    })

    it('should throw if greater than #end', function () {
      (function () {
        new Interval(10, 5);
      }).should.throw('The #start should be smaller then #end endpoint.');
    })

    it('should be a property', function () {
      new Interval(5, 10).should.have.property('start', 5);
    })
  })

  describe('#end', function () {
    it('should throw if not provided', function () {
      (function () {
        new Interval(5);
      }).should.throw('The interval endpoints are required.');
    })

    it('should throw if not a number', function () {
      (function () {
        new Interval(5, 'a');
      }).should.throw('The interval endpoints must be of type number.');
    })

    it('should throw if smaller than #start', function () {
      (function () {
        new Interval(10, 5);
      }).should.throw('The #start should be smaller then #end endpoint.');
    })

    it('should be a property', function () {
      new Interval(5, 10).should.have.property('end', 10);
    })
  })

  describe('#data', function () {
    it('should be optional', function () {
      (function () {
        new Interval(5, 10);
      }).should.not.throw();
    })

    it('should be a property', function () {
      new Interval(5, 10, 'foo').should.have.property('data', 'foo');
    })
  })

  describe('#compare()', function () {
    var interval = new Interval(5, 10);

    it('should return SUBSET if given interval is equal to endpoints', function () {
      var other = new Interval(5, 10);
      interval.compare(other).should.be.eql(Interval.SUBSET);
    })

    it('should return SUBSET if given interval is between endpoints', function () {
      var other = new Interval(6, 9);
      interval.compare(other).should.be.eql(Interval.SUBSET);
    })

    it('should return SUPERSET if endpoints are between given interval', function () {
      var other = new Interval(4, 11);
      interval.compare(other).should.be.eql(Interval.SUPERSET);
    })

    it('should return INTERSECT if given interval starts between and ends after endpoints', function () {
      var other = new Interval(6, 11);
      interval.compare(other).should.be.eql(Interval.INTERSECT);
    })

    it('should return INTERSECT if given interval end between and start before endpoints', function () {
      var other = new Interval(4, 10);
      interval.compare(other).should.be.eql(Interval.INTERSECT);
    })

    it('should return DISJOINT if given interval is before start endpoint', function () {
      var other = new Interval(0, 4);
      interval.compare(other).should.be.eql(Interval.DISJOINT);
    })

    it('should return DISJOINT if given interval is after end endpoint', function () {
      var other = new Interval(11, 15);
      interval.compare(other).should.be.eql(Interval.DISJOINT);
    })
  })
  
})