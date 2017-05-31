// routes/index.js
const noteRoutes = require('./note_routes');
module.exports = function(app) {
  noteRoutes(app);
  // Other route groups could go here, in the future
};
