
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

  // article routes
  // var articles = require('../app/controllers/articles')
  // app.get('/articles', articles.index)
  // app.get('/articles/new', auth.requiresLogin, articles.new)
  // app.post('/articles', auth.requiresLogin, articles.create)
  // app.get('/articles/:id', articles.show)
  // app.get('/articles/:id/edit', auth.requiresLogin, auth.article.hasAuthorization, articles.edit)
  // app.put('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.update)
  // app.del('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy)

  // app.param('id', articles.article)

   // phases routes
  var phases = require('../app/controllers/phases')
  app.get('/phases', phases.index)
  app.get('/graph', phases.showgraph)
  // app.get('/phases/new', auth.requiresLogin, phases.new)
  // app.post('/phases', auth.requiresLogin, phases.create)
  app.get('/phases/:phase_id', phases.show)

  app.param('phase_id', phases.phase)

  // techniques routes
  var techniques = require('../app/controllers/techniques')
  app.get('/techniques', techniques.index)
  app.get('/phases/:phase_id/new', auth.requiresLogin, techniques.new)
  app.post('/phases/:phase_id', auth.requiresLogin, techniques.create)
  app.get('/techniques/:technique_id', techniques.show)

  // app.get('/techniques/:id/edit', auth.requiresLogin, auth.technique.hasAuthorization, techniques.edit)
  // app.put('/techniques/:id', auth.requiresLogin, auth.technique.hasAuthorization, techniques.update)
  // app.del('/techniques/:id', auth.requiresLogin, auth.technique.hasAuthorization, techniques.destroy)

  app.param('technique_id', techniques.technique)

  // home route
  app.get('/', phases.index)

  // comment routes
  // var comments = require('../app/controllers/comments')
  // app.post('/articles/:id/comments', auth.requiresLogin, comments.create)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
