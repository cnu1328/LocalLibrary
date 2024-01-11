const express = require("express");
const router = express.Router();

const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const book_instance_controller = require("../controllers/bookinstanceController");
const genre_controller = require("../controllers/genreController");


/// BOOK ROUTES ///

// GET catalog home page

router.get("/", book_controller.index); //This actually maps to /catalog/ because we import the route with a /catalog prefix

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).

router.get("/book/create", book_controller.book_create_get);

// POST request for creating Book.

router.post("/book/create", book_controller.book_create_post);

// GET request to delete Book.

router.get("/book/:id/delete", book_controller.book_delete_get);

//POST request to delete the Book

router.post("/book/:id/delete", book_controller.book_delete_post);

//GET request to update book

router.get("/book/:id/update", book_controller.book_update_get);

//POST request to update book

router.post("/book/:id/update", book_controller.book_update_post);

//Get request for one book

router.get("/book/:id", book_controller.book_detail);

//Get request for all books

router.get("/books", book_controller.book_list);


/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).

router.get("/author/create", author_controller.author_create_get);

// POST request for creating Author.

router.post("/author/create", author_controller.author_create_post);

// GET request to delete Author.

router.get("/author/:id/delete", author_controller.author_delete_get);

//POST request to delete Author

router.post("/author/:id/delete", author_controller.author_delete_post);

//GET request to update Author.

router.get("/author/:id/update", author_controller.author_update_get);

//POST request to update Author

router.post("/author/:id/update", author_controller.author_update_post);

//GET request for one author

router.get("/author/:id", author_controller.author_detail);

//Get Request for list of all authors

router.get("/authors", author_controller.author_list);


/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).

router.get("/genre/create", genre_controller.genre_create_get);

//Post request for creating a Genre

router.post('/genre/create', genre_controller.genre_create_post);

//GET request for delete a Genre

router.get("/genre/:id/delete", genre_controller.genre_delete_get);

//POST request to delete Genre

router.post("/genre/:id/delete", genre_controller.genre_delete_post);

//GET request to update genre

router.get("/genre/:id/update", genre_controller.genre_update_get);

//POST request to update genre

router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.

router.get("/genre/:id", genre_controller.genre_detail);

//GET request for list of all Genre

router.get("/genres", genre_controller.genre_list);


/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).

router.get("/bookinstance/create", book_instance_controller.bookinstance_create_get);

//Post request for creating a BookInstance

router.post("/bookinstance/create", book_instance_controller.bookinstance_create_post);

//Get request for delete a book instace

router.get("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_get);

//Post request for delete a book instace

router.post("/bookinstance/:id/delete", book_instance_controller.bookinstance_delete_post);

//Get request to update bookinstance

router.get("/bookinstance/:id/update", book_instance_controller.bookinstance_update_get);

//Post request fo update book instance

router.post("/bookinstance/:id/update", book_instance_controller.bookinstance_update_post);

//// GET request for one BookInstance.

router.get("/bookinstance/:id", book_instance_controller.bookinstance_detail);

//Get request for list of all book instances

router.get("/bookinstances", book_instance_controller.bookinstance_list);

module.exports = router;
