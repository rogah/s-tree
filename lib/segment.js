
function Segment(start, end) {
  _validate(start, end);
  
  this.start = start;
  this.end = end;
}

Segment.DISJOINT = 1;
Segment.SUBSET = 2;
Segment.SUPERSET = 3;
Segment.INTERSECT = 4;

Segment.prototype.compareTo = function (other) {
  var isDisjoint = other.start > this.end || other.end < this.start;
  if (isDisjoint)
    return Segment.DISJOINT;

  var isThisInBetween = other.start <= this.start && other.end >= this.end;
  if (isThisInBetween)
    return Segment.SUBSET;

  var isOtherInBetween = other.start > this.start && other.end < this.end;
  if (isOtherInBetween)
    return Segment.SUPERSET;

  return Segment.INTERSECT;
}

Segment.prototype.overlapWith = function (other, enpoints) {
  var includeEndpoints = enpoints === undefined ? true : enpoints;

  if (includeEndpoints) {
    if (other.start > this.end || other.end < this.start)
      return false;
  } else {
    if (other.start >= this.end || other.end <= this.start)
      return false;
  }
  return true;
}

function _validate(start, end) {
  if (start === undefined || end === undefined)
    throw new Error('Both #start and #end points are required.');
 
  if (typeof start !== 'number' || typeof end !== 'number')
    throw new Error('Both #start and #end points must be of type number.');

  if (start > end)
    throw new Error('The #start should be smaller then #end point.');
}

module.exports = Segment;