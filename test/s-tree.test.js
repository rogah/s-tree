var should = require('should');

var segment = require('../lib/s-tree');

describe('stree', function () {

  it('should be a function', function () {
    segment.should.be.a.function;
  });

  it('should accept a callback which returns an object interface', function () {
    segment(function (tree) {
      tree.should.be.an.object;
    });
  });

  describe('#callback(tree)', function () {

    it('should expose #hasIntervals() method', function () {
      segment(function (tree) {
        tree.hasIntervals.should.be.a.Function;
      });
    });

    it('should expose #push() method', function () {
      segment(function (tree) {
        tree.push.should.be.a.Function;
      });
    });

    it('should expose #clear() method', function () {
      segment(function (tree) {
        tree.clear.should.be.a.Function;
      });
    });

    it('should expose #build() method', function () {
      segment(function (tree) {
        tree.build.should.be.a.Function;
      });
    });

    it('should expose #isBuilt() method', function () {
      segment(function (tree) {
        tree.isBuilt.should.be.a.Function;
      });
    });

    it('should expose #query() method', function () {
      segment(function (tree) {
        tree.query.should.be.a.Function;
      });
    });
  });

  describe('#hasIntervals()', function () {

    it('should return false prior to add any interval to the tree', function () {
      segment(function (tree) {
        tree.hasIntervals().should.be.false;
      });
    });

    it('should add intervals to the tree', function () {
      segment(function (tree) {
        tree.push(5, 10, 'foo').hasIntervals().should.be.true;
      });
    });
  });

  describe('#push()', function () {

    it('should implement the chain pattern by returning the tree itself', function () {
      segment(function (tree) {
        tree.push(5, 10, 'foo').should.be.eql(tree);
      });
    });

    it('should add intervals to the tree', function () {
      segment(function (tree) {
        tree.push(5, 10, 'foo').hasIntervals().should.be.true;
      });
    });
  });

  describe('#clear()', function () {

    it('should implement the chain pattern by returning the tree itself', function () {
      segment(function (tree) {
        tree.clear().should.be.eql(tree);
      });
    });

    it('should clear intervals in the tree', function () {
      segment(function (tree) {
        tree.push(5, 10).hasIntervals().should.be.true;
        tree.clear().hasIntervals().should.be.false;
      });
    });
  });

  describe('#build()', function () {

    it('should implement the chain pattern by returning the tree itself', function () {
      segment(function (tree) {
        tree.push(5, 10).build().should.be.eql(tree);
      });
    });

    it('should build the tree', function () {
      segment(function (tree) {
        tree.push(5, 10).build().isBuilt().should.be.true;
      });
    });
  });

  describe('#query()', function () {

    it('should return the number of intervals queried', function () {
      segment(function (tree) {
        tree.push(1, 3)
          .push(5, 12)
          .push(8, 14)
          .push(12, 16)
          .push(15, 20)
          .build();

        tree.query({
          start: 10,
          end: 14
        }).should.be.eql(3);
      });
    });

    it('should provide a array with the intervals queried', function () {
      segment(function (tree) {
        tree.push(5, 12, 'foo')
          .push(8, 14, 'bar')
          .push(12, 16, 'baz')
          .push(15, 20, 'qux')
          .build();

        tree.query({
          start: 13,
          end: 14
        }, function (intervals) {

          intervals.should.containDeep([{
            start: 8,
            end: 14,
            data: 'bar'
          }, {
            start: 12,
            end: 16,
            data: 'baz'
          }]);
        });
      });
    });
  });
});
