var Book = require('../models/book');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all books.
exports.book_index_route = function(req, res) {
    res.send('NOT IMPLEMENTED: Book INDEX ROUTE');
};

// Show new book form
exports.book_new_route = function(req, res) {
    res.send('NOT IMPLEMENTED: Book NEW ROUTE');
};

// Create a new book, then redirect somewhere
exports.book_create_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Book CREATE ROUTE');
};

// Show info about one specific book
exports.book_show_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Book SHOW ROUTE');
};

// Show edit form for one specific book
exports.book_edit_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Book EDIT ROUTE');
};

// Update a particular book, then redirect somewhere
exports.book_update_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Book UPDATE ROUTE');
};

// Delete a particular book, then redirect somewhere
exports.book_destroy_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Book DESTROY ROUTE');
};
