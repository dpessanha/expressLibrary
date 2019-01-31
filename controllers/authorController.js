const Author  = require('../models/author');
const Book    = require('../models/book');
const async   = require('async');

const { body, validationResult }  = require('express-validator/check');
const { sanitizeBody }            = require('express-validator/filter');

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
exports.author_new_route = function(req, res, next) {
  res.render('author_form', { title: 'Create Author' });
};

// Create a new author, then redirect somewhere
exports.author_create_route = [
  
  // Validate fields
  body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name musn\'t be empty')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters'),

  body('family_name')
  .isLength({ min: 1 })
  .trim()
  .withMessage('Family name musn\'t be empty')
  .isAlphanumeric()
  .withMessage('Family name has non-alphanumeric characters'),

  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),

  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),
  
  // Sanitize fields
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages
      res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid. Create an Author object with scaped and trimmed data
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      author.save(function(err) {
        if(err) { return next(err); }
        // Successful, so redirect
        res.redirect(author.url);
      });
    }
  }
];

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
exports.author_destroy_route = function(req, res, next) {
  async.parallel({
    author: function(callback) {
      Author.findById(req.body.author_id).exec(callback)
    },
    authors_books: function(callback) {
      Book.find({ 'author': req.body.author_id }).exec(callback)
    },
  }, function(err, results) {
    if(err) { return next(err); }
    // Success
    if(results.authors_books.lenght > 0) {
      // Author has books. Render in same way as for GET ROUTE
      res.render('author_detail', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
      return;
    }
    else {
      // Author has no books. Delete object and redirect to the list of authors
      Author.findByIdAndRemove(req.body.author_id, function(err) {
        if(err) { return next(err); }
        // Success, so go to authors list
        res.redirect('/catalog/authors')
      })
    }
  })
};
