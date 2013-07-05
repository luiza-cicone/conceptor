
var async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin)
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

  app.param('userId', users.user)

  var techniques = require('../app/controllers/techniques')
  var forms = require('../app/controllers/forms')
  var phases = require('../app/controllers/phases')

  //
  // admin routes
  //

  var admin = require('../app/controllers/admin')

  app.get('/admin', auth.requiresLogin, admin.index)

  app.get('/admin/techniques', auth.requiresLogin, admin.techniques)
  app.get('/admin/techniques/new', auth.requiresLogin, admin.newTechnique)
  app.put('/admin/techniques/:type', auth.requiresLogin, admin.modifyTechnique)
  app.get('/admin/techniques/:type', auth.requiresLogin, admin.show)
  app.post('/admin/techniques', auth.requiresLogin, admin.createTechnique)

  app.param('type', admin.technique)

  //
  // phases 
  //

  // graph
  app.get('/graph', phases.graph)

  // techniques
  app.get   ('/phases', phases.index)
  app.get   ('/phases/:phase_id', phases.show)

  app.get   ('/phases/:phase_id/new', auth.requiresLogin, techniques.new)
  app.get   ('/phases/:phase_id/new/:type', auth.requiresLogin, techniques.newType)
  app.post  ('/phases/:phase_id', auth.requiresLogin, techniques.create)

  app.get   ('/phases/:phase_id/:technique_id', auth.requiresLogin, techniques.show)
  app.get   ('/phases/:phase_id/:technique_id/edit', auth.requiresLogin, techniques.edit)
  app.put   ('/phases/:phase_id/:technique_id', auth.requiresLogin, techniques.update)
  app.del   ('/phases/:phase_id/:technique_id', auth.requiresLogin, techniques.destroy)

  app.param('phase_id', phases.phase)
  app.param('technique_id', techniques.technique)

  //
  // home route
  //
  app.get('/', phases.index)

  //
  // tag routes
  //
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
