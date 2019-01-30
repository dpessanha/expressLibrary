var BookInstance = require('../models/bookinstance');

// List all bookInstances
exports.bookinstance_index_route = function(req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec(function(err, list_bookinstances) {
      if(err) { return next(err); }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
};

// Show new bookInstance form
exports.bookinstance_new_route = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance NEW ROUTE');
};

// Create a new bookInstance, then redirect somewhere	
exports.bookinstance_create_route = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance CREATE ROUTE');
};

// Show info about one specific bookInstance		
exports.bookinstance_show_route = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance SHOW ROUTE');
};

// Show edit form for one specific bookInstance			
exports.bookinstance_edit_route = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance EDIT ROUTE');
};

// Update a particular bookInstance, then redirect somewhere			
exports.bookinstance_update_route = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance UPDATE ROUTE');
};

// Delete a particular bookInstance, then redirect somewhere				
exports.bookinstance_destroy_route = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance DESTROY ROUTE');
};
