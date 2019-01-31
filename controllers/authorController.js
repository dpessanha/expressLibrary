const Author  = require('../models/author');
const Book    = require('../models/book');
const async   = require('async');

// List all authors
exports.author_index_route = function(req, res, next) {
    Author.find()
      .sort( [ [ 'family name', 'ascending' ] ] )
      .exec(function(err, list_authors) {
        if(err) { return next(err); }
        // Successful, so render
        res.render('author_list', { title: 'Author List', author_list: list_authors });
      });
};

// Show new author form
exports.author_new_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Author NEW ROUTE');
};

// Create a new author, then redirect somewhere
exports.author_create_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Author CREATE ROUTE');
};

// Show info about one specific author
exports.author_show_route = function(req, res, next) {
  async.parallel ({
    author: function(callback) {
      Author.findById(req.params.id)
        .exec(callback)
    },
    authors_books: function(callback) {
      Book.find({ 'author': req.params.id }, 'title summary')
        .exec(callback)
    },
  }, function(err, results) {
    if(err) { return next(err);}
    if(results.author==null) {
      var err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
  });
};

// Show edit form for one specific author
exports.author_edit_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Author EDIT ROUTE');
};

// Update a particular author, then redirect somewhere	
exports.author_update_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Author UPDATE ROUTE');
};

// Delete a particular author, then redirect somewhere	
exports.author_destroy_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Author DESTROY ROUTE');
};
