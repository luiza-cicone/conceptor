
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id)
      }
      next()
    }
}


/*
 *  Technique authorizations routing middleware
 */

exports.technique = {
    hasAuthorization : function (req, res, next) {
      if (req.technique.user.id != req.user.id) {
        return res.redirect('/techniques/'+req.technique.id)
      }
      next()
    }
}
