const Book          = require('../models/book');
const Author        = require('../models/author');
const Genre         = require('../models/genre');
const BookInstance  = require('../models/bookinstance');
const async         = require('async');

const { body, validationResult }  = require('express-validator/check');
const { sanitizeBody }            = require('express-validator/filter');

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
exports.book_new_route = function(req, res, next) {
  // Get all authors and genres, which we can use for adding to our book
  async.parallel({
    authors: function(callback) {
      Author.find(callback);
    },
    genres: function(callback) {
      Genre.find(callback);
    },
  }, function(err, results) {
    if(err) { return next(err); }
    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
};

// Create a new book, then redirect somewhere
exports.book_create_route = [
  // Convert the genre to an array
  (req, res, next) => {
    if(!(req.body.genre instanceof Array)) {
      if(typeof req.body.genre==='undefined')
        req.body.genre=[];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate fields
  body('title', 'Title musn\'t be empty').isLength({ min: 1 }).trim(),
  body('author', 'Author musn\'t be empty').isLength({ min: 1 }).trim(),
  body('summary', 'Summary musn\'t be empty').isLength({ min: 1 }).trim(),
  body('isbn', 'ISBN musn\'t be empty').isLength({ min: 1 }).trim(),

  // Sanitize fields (using wildcards)
  sanitizeBody('*').trim().escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data
    var book = new Book({
      title   : req.body.title,
      author  : req.body.author,
      summary : req.body.summary,
      isbn    : req.body.isbn,
      genre   : req.body.genre,
    });

    if(!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages

      // Get all authors and genres from form
      async.parallel({
        authors: function(callback) {
          Author.find(callback);
        },
        genres: function(callback) {
          Genre.find(callback);
        },
      }, function(err, results) {
        if(err) { return next(err); }

        // Mark our selected genres as checked
        for(let i = 0; i < results.genres.length; i++) {
          if(book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked='true';
          }
        }
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
      });
      return;
    }
    else {
      // Data from form is valid. Save book
      book.save(function(err) {
        if(err) { return next(err); }
        // Successful, so redirect to new book record
        res.redirect(book.url);
      });
    }
  }
];

// Show info about one specific book
exports.book_show_route = function(req, res, next) {
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function(callback) {
      BookInstance.find({ 'book': req.params.id })
      .exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
      if (results.book==null) { // No results.
        var err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }
    // Successful, so render.
    res.render('book_detail', { title: 'Title', book: results.book, book_instances: results.book_instance } );
  });
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
exports.book_destroy_route = function(req, res, next) {
  Book.findByIdAndRemove(req.body.bookid, function(err) {
    if(err) { return next(err); }
      // Success, so go to authors list
      res.redirect('/catalog/books')
    });
};
