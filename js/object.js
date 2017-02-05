Object.prototype.build = function() {
  var instance = Object.create(this);
  if (_.isFunction(instance.init)) {
    instance.init.apply(instance, arguments);
  }
  return instance;
};
