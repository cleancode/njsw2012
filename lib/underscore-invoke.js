

module.exports = function(_) {
  _.mixin({
    invokeEach: _.invoke,
    invokeArray: function(args, func, context) {
      return func.call(context || null, args)
    },
    invokeSplat: function(args, func, context) {
      if (_.isArray(args)) {
        return func.apply(context || null, args)
      }
      return func.call(context || null, args)
    }
  })
  return _
}
