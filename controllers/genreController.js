const Genre = require('../models/genre');
const Book  = require('../models/book');
const async = require('async');

// List all genres	
exports.genre_index_route = function(req, res, next) {
  Genre.find()
  .sort( [ [ 'name', 'ascending' ] ] )
  .exec(function(err, list_genres) {
    if(err) { return next(err); }
    // Successful, so render
    res.render('genre_list', { title: 'Genre List', genre_list: list_genres });
  });
};

// Show new genre form		
exports.genre_new_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre NEW ROUTE');
};

// Create a new genre, then redirect somewhere			
exports.genre_create_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre CREATE ROUTE');
};

// Show info about one specific genre				
exports.genre_show_route = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findOne(req.params.id)
        .exec(callback);
    },
    genre_books: function(callback) {
      Book.find({ 'genre': req.params.id })
        .exec(callback);
    },
  }, function(err, results) {
    if(err) { return next(err); }
    if(results.genre==null) { // No results
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('genre_show', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
  });
};

// Show edit form for one specific genre				
exports.genre_edit_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre EDIT ROUTE');
};

// Update a particular genre, then redirect somewhere					
exports.genre_update_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre UPDATE ROUTE');
};

// Delete a particular genre, then redirect somewhere				
exports.genre_destroy_route = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre DESTROY ROUTE');
};
