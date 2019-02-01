var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookinstanceController');

/// BOOK ROUTES ///

// 
router.get('/', book_controller.index);

// INDEX ROUTE
router.get('/books', book_controller.book_index_route);

// NEW ROUTE
router.get('/books/new', book_controller.book_new_route);

// CREATE ROUTE
router.post('/books', book_controller.book_create_route);

// SHOW ROUTE
router.get('/books/:id', book_controller.book_show_route);

// EDIT ROUTE
router.get('/books/:id/edit', book_controller.book_edit_route);

// UPDATE ROUTE
router.put('/books/:id', book_controller.book_update_route);

// DESTROY ROUTE
router.delete('/books/:id', book_controller.book_destroy_route);




/// AUTHOR ROUTES ///

// INDEX ROUTE
router.get('/authors', author_controller.author_index_route);

// NEW ROUTE
router.get('/authors/new', author_controller.author_new_route);

// CREATE ROUTE
router.post('/authors', author_controller.author_create_route);

// SHOW ROUTE
router.get('/authors/:id', author_controller.author_show_route);

// EDIT ROUTE
router.get('/authors/:id/edit', author_controller.author_edit_route);

// UPDATE ROUTE
router.put('/authors/:id', author_controller.author_update_route);

// DESTROY ROUTE (GET)
router.get('/authors/:id/delete', author_controller.author_destroy_route_get);

// DESTROY ROUTE
router.delete('/authors/:id', author_controller.author_destroy_route_delete);




/// GENRE ROUTES ///

// INDEX ROUTE
router.get('/genres', genre_controller.genre_index_route);

// NEW ROUTE
router.get('/genres/new', genre_controller.genre_new_route);

//CREATE ROUTE
router.post('/genres', genre_controller.genre_create_route);

// SHOW ROUTE
router.get('/genres/:id', genre_controller.genre_show_route);

// EDIT ROUTE
router.get('/genres/:id/edit', genre_controller.genre_edit_route);

// UPDATE ROUTE
router.put('/genres/:id', genre_controller.genre_update_route);

// DESTROY ROUTE (GET)
router.get('/genres/:id/delete', genre_controller.genre_destroy_route_get);

// DESTROY ROUTE
router.delete('/genres/:id', genre_controller.genre_destroy_route_delete);




/// BOOKINSTANCE ROUTES ///

// INDEX ROUTE
router.get('/bookinstances', book_instance_controller.bookinstance_index_route);

// NEW ROUTE
router.get('/bookinstances/new', book_instance_controller.bookinstance_new_route);

// CREATE ROUTE 
router.post('/bookinstances', book_instance_controller.bookinstance_create_route);

// SHOW ROUTE
router.get('/bookinstances/:id', book_instance_controller.bookinstance_show_route);

// EDIT ROUTE
router.get('/bookinstances/:id/edit', book_instance_controller.bookinstance_edit_route);

// UPDATE ROUTE
router.put('/bookinstances/:id', book_instance_controller.bookinstance_update_route);

// DESTROY ROUTE
router.delete('/bookinstances/:id', book_instance_controller.bookinstance_destroy_route);

module.exports = router;