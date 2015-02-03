var IntervalSet = require('../lib/interval-set');

describe('IntervalSet', function () {

  describe('#push()', function () {
    var intervalSet;

    beforeEach(function () {
      intervalSet = new IntervalSet();
    })

    it('should throw if interval start is not provided', function () {
      (function () {
        intervalSet.push();
      }).should.throw();
    })

    it('should throw if interval end is not provided', function () {
      (function () {
        intervalSet.push(5);
      }).should.throw();
    })

    it('should not throw if interval data is not provided', function () {
      (function () {
        intervalSet.push(5, 10);
      }).should.not.throw();
    })

    it('should add interval', function () {
      intervalSet.push(5, 10);
      intervalSet.intervals.length.should.be.eql(1);
    })
  })

  describe('#pushAll()', function () {
    var intervalSet;

    beforeEach(function () {
      intervalSet = new IntervalSet();
    })

    it('should throw if #starts of interval is not provided', function () {
      (function () {
        intervalSet.pushAll();
      }).should.throw('Invalid parameter. Parementers #starts must be a Array.');
    })

    it('should throw if #starts of interval is not an Array type', function () {
      (function () {
        intervalSet.pushAll('string');
      }).should.throw('Invalid parameter. Parementers #starts must be a Array.');
    })

    it('should throw if #ends of interval is not provided', function () {
      (function () {
        intervalSet.pushAll([1, 5]);
      }).should.throw('Invalid parameter. Parementer #ends must be a Array.');
    })

    it('should throw if #ends of interval is not an Array type', function () {
      (function () {
        intervalSet.pushAll([1, 5], 'string');
      }).should.throw('Invalid parameter. Parementer #ends must be a Array.');
    })

    it('should not throw if #data of interval is not provided', function () {
      (function () {
        intervalSet.pushAll([1, 5], [5, 10]);
      }).should.not.throw();
    })

    it('should throw if #data is provided but not as an Array type', function () {
      (function () {
        intervalSet.pushAll([1, 5], [5, 10], 'foo');
      }).should.throw('Invalid parameter. Parementer #data (optional), if provided, must be a Array.');
    })

    it('should throw if #starts does not match #ends length', function () {
      (function () {
        intervalSet.pushAll([1], [5, 10]);
      }).should.throw('Invalid parameter. Parementers #starts, #ends and #data (optional) must have the same length.');
    })

    it('should throw if #ends does not match #starts length', function () {
      (function () {
        intervalSet.pushAll([1, 5], [5]);
      }).should.throw('Invalid parameter. Parementers #starts, #ends and #data (optional) must have the same length.');
    })

    it('should throw if #data does not match #starts length', function () {
      (function () {
        intervalSet.pushAll([1, 5], [5, 10], ['foo']);
      }).should.throw('Invalid parameter. Parementers #starts, #ends and #data (optional) must have the same length.');
    })

    it('should add intervals without optional data Array', function () {
        intervalSet.pushAll([1, 10], [5, 10]);
        intervalSet.intervals.length.should.eql(2);
    })

    it('should add intervals with optional data Array', function () {
        intervalSet.pushAll([1, 10], [5, 10], ['foo', 'bar']);
        intervalSet.intervals.length.should.eql(2);
    })
  })

  describe('#clear()', function () {
    it('should delete all intervals', function () {
      var intervalSet = new IntervalSet();
      intervalSet.push(5, 10, 'foo');
      intervalSet.clear();
      intervalSet.intervals.length.should.be.eql(0);
    })
  })
})