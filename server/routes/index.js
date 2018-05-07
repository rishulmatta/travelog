const resourcesRouter = require('./resources'),
        indexRouter = require('./user-lifecycle');
// Import routes
function requiresLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.status(401).json('You must be logged in to view this page.')
  }
}

module.exports = function(app) {
    app.use('/api/v0/resources', requiresLogin, resourcesRouter);
    app.use('/api/v0/auth', indexRouter);
}