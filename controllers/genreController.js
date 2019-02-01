const Genre     = require('../models/genre');
const Book      = require('../models/book');
const async     = require('async');
const mongoose  = require('mongoose');

const { body, validationResult }  = require('express-validator/check');
const { sanitizeBody }            = require('express-validator/filter');

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
exports.genre_new_route = function(req, res, next) {
  res.render('genre_form', { title: 'Create Genre' });
};

// Create a new genre, then redirect somewhere			
exports.genre_create_route = [

  // Validate that the name field is not empty
  body('name', 'Genre name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field
  sanitizeBody('name').trim().escape(),

  // Process request afetr validation and sanitization
  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data
    var genre = new Genre( {
      name: req.body.name
    });

    if(!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
    return;
    }
    else {
      // Data from form is valid. Check if Genre with same name exists
      Genre.findOne({ 'name': req.body.name })
        .exec( function(err, found_genre) {
          if(err) { return next(err); }

          if(found_genre) {
            // Genre exists. Redirect to its show page
            res.redirect(found_genre.url);
          }
          else {
            genre.save(function(err) {
              if(err) { return next(err); }
              // Genre saved. Redirect to its show page
              res.redirect(genre.url);
            });
          }
        });
    }
  }
];

// Show info about one specific genre				
exports.genre_show_route = function(req, res, next) {
  var id =  mongoose.Types.ObjectId(req.params.id);
  
  async.parallel({
    genre: function(callback) {
      Genre.findById(id)
        .exec(callback);
    },

    genre_books: function(callback) {
      Book.find({ 'genre': id })
      .exec(callback);
    },

  }, function(err, results) {
    if (err) { return next(err); }
    if (results.genre==null) { // No results.
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
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

// Show DELETE page and info about this genre and his books
exports.genre_destroy_route_get = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id)
      .exec(callback)
    },
    genres_books: function(callback) {
      Book.find({ 'genre': req.params.id })
      .exec(callback)
    },
  }, function(err, results) {
    if(err) { return next(err); }
    if(results.genre==null) {
      res.redirect('/catalog/genres');
    }
    // Successful, so render
    res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genres_books });
  });
};

// Delete a particular genre, then redirect somewhere	
exports.genre_destroy_route_delete = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.body.genreid)
      .exec(callback)
    },
    genres_books: function(callback) {
      Book.find({ 'genre': req.body.genreid })
      .exec(callback)
    },
  }, function(err, results) {
    if(err) { return next(err); }
    // Success
    if(results.genres_books.lenght > 0) {
      // Genre has books. Render in same way as for GET ROUTE
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genres_books });
      return;
    }
    else {
      // Genre has no books. Delete object and redirect to the list of genres
      Genre.findByIdAndRemove(req.body.genreid, function(err) {
        if(err) { return next(err); }
        // Success, so go to genres list
        res.redirect('/catalog/genres')
      })
    }
  });
};