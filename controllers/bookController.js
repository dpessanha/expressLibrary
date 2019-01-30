const Book          = require('../models/book');
const Author        = require('../models/author');
const Genre         = require('../models/genre');
const BookInstance  = require('../models/bookinstance');

const async = require('async');

exports.index = function(req, res) {
  async.parallel({
    book_count: function(callback) {
      Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection 
    },
    book_instance_count: function(callback) {
      BookInstance.countDocuments({}, callback);
    },
    book_instance_available_count: function(callback) {
      BookInstance.countDocuments({ status: 'Available' }, callback);
    },
    author_count: function(callback) {
      Author.countDocuments({}, callback);
    },
    genre_count: function(callback) {
      Genre.countDocuments({}, callback);
    }
  }, function(err, results) {
    res.render('index', { title: 'Local Library Home', error: err, data: results });
  });
};

// Display list of all books.
exports.book_index_route = function(req, res, next) {
    Book.find({}, 'title author')
      .populate('author')
      .exec(function(err, list_books) {
        if(err) {return next(err);}
        // Successful, so render
        res.render('book_list', { title: 'Book List', book_list: list_books });
      });
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
