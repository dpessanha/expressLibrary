const BookInstance  = require('../models/bookinstance');
const Book          = require('../models/book');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody }          = require('express-validator/filter');

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
exports.bookinstance_new_route = function(req, res, next) {
  Book.find({},'title')
  .exec(function (err, books) {
    if (err) { return next(err); }
    // Successful, so render.
    res.render('bookinstance_form', {title: 'Create BookInstance', book_list:books});
  });  
};

// Create a new bookInstance, then redirect somewhere	
exports.bookinstance_create_route = [
  // Validate fields.
  body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
  body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
  // Sanitize fields.
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),
    
  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    var bookinstance = new BookInstance(
      { book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
      }
    );

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values and error messages.
        Book.find({},'title')
          .exec(function (err, books) {
            if (err) { return next(err); }
              // Successful, so render.
              res.render('bookinstance_form', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
          });
          return;
      }
      else {
        // Data from form is valid.
        bookinstance.save(function (err) {
        if (err) { return next(err); }
          // Successful - redirect to new record.
          res.redirect(bookinstance.url);
        });
      }
  }  
];

// Show info about one specific bookInstance		
exports.bookinstance_show_route = function(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec(function(err, bookinstance) {
    if(err) {return next(err);}
    if(bookinstance==null) {
      var err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('bookinstance_detail', { title: 'Book:', bookinstance: bookinstance });
  });
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
