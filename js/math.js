Math.TAU = Math.PI * 2;

Math.polarToCartesian = function(vector, origin) {
  if (!_.isArray(origin)) origin = [0, 0];
  var r = vector[0];
  var theta = vector[1];

  var x = Math.cos(theta) * r;
  var y = Math.sin(theta) * r;

  return [origin[0] + x, origin[1] + y];
};

Math.cartesianToPolar = function(vector, origin) {
  if (!_.isArray(origin)) origin = [0, 0];
  var x = vector[0] - origin[0];
  var y = vector[1] - origin[1];

  var r = Math.sqrt((x * x) + (y * y));
  var theta = Math.atan2(y, x);

  return [r, theta];
};