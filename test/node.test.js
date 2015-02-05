var Node = require('../lib/node'),
  Segment = require('../lib/segment');

describe('Node', function () {
  describe('when creating a new instance', function () {
    var node = new Node(5, 10);

    it('should have #left node property as null', function () {
      node.should.have.property('left', null);
    })

    it('should have #right node property as null', function () {
      node.should.have.property('right', null);
    })

    it('should have #segment property of type Segment', function () {
      node.segment.should.be.an.instanceOf(Segment).and.be.eql(new Segment(5, 10));
    })

    it('should have #intervals node property as empty Array', function () {
      node.should.have.property('intervals', []);
    })
  })
});