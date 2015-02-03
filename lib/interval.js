
function Interval(start, end, data) {
  _validateInterval(start, end);
  
  this.id = Interval.prototype.newId();
  this.start = start;
  this.end = end;
  this.data = data;
}

Interval.DISJOINT = 0;
Interval.SUBSET = 1;
Interval.SUPERSET = 2;
Interval.INTERSECT = 3;

Interval.prototype.newId = function () {
  return new Date().getTime();
}

Interval.prototype.compare = function (other) {
  var isOtherInBetween = other.start >= this.start && other.end <= this.end;
  if (isOtherInBetween)
    return Interval.SUBSET;

  var isThisInBetweenOther = other.start < this.start && other.end > this.end;
  if (isThisInBetweenOther)
    return Interval.SUPERSET;

  var startsInBetweenAndEndsAfter = (other.start >= this.start && other.start <= this.end) && (other.end > this.end),
    endsInBetweenAndStartsBofore = (other.start < this.start && other.end >= this.start) && (other.end <= this.end);
  if (startsInBetweenAndEndsAfter || endsInBetweenAndStartsBofore)
    return Interval.INTERSECT;

  return Interval.DISJOINT;
}

function _validateInterval(start, end) {
  if (start === undefined || end === undefined)
    throw new Error('The interval endpoints are required.');
 
  if (typeof start !== 'number' || typeof end !== 'number')
    throw new Error('The interval endpoints must be of type number.');

  if (start > end)
    throw new Error('The #start should be smaller then #end endpoint.');
}

module.exports = Interval;