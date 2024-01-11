
const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require('express-validator');
//Display list of all Authors

exports.author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({surname : 1}).exec();

    res.render('author_list', {
        title: "Author List",
        author_list: allAuthors,
    });
});

// Display detail page for a specific Author.

exports.author_detail = asyncHandler(async (req, res, next) => {
    const [authorDetail, authorBooks] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author : req.params.id}, "title summary").exec(),
    ]); 

    if(authorDetail === null) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }


    res.render("author_detail", {
        authorDetail: authorDetail,
        authorBooks: authorBooks,
    });
});

// Display Author create form on GET.

exports.author_create_get = (req, res, next) => {
    res.render('author_form', {
        title: "Create Author",
    });
};

//Handle Author create on POST

exports.author_create_post = [
    // Validate and sanitize fields.

    body("first_name")
        .trim()
        .isLength({min : 1})
        .escape()
        .withMessage("First name must be specified.")
        .isAlpha()
        .withMessage("First name has non-alphanumeric characters."),
    
    body("family_name")
        .trim()
        .isLength({min : 1})
        .escape()
        .withMessage("Family name must be specified.")
        .isAlpha()
        .withMessage("Family name has non-alphanumberic characters."),

    body("date_of_birth", "Invalid date of Birth")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),

    body("date_of_deadth", "Invalid date of Deadth")
        .optional({values : "falsy"})
        .isISO8601()
        .toDate(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        const author = new Author({
            first_name: req.body.first_name,
            surname: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_deadth: req.body.date_of_deadth
        });

        if(!errors.isEmpty()) {
            res.render("author_form", {
                title: "Create Author",
                author: author,
                errors: errors.array(),
            });
            return; 
        } else {            
            await author.save();
            //Redirect to new author record
            res.redirect(author.url);

        }
    }),
];


// Display Author delete form on GET.

exports.author_delete_get = asyncHandler(async (req, res, next) => {
     // Get details of author and all their books (in parallel)
    const [author, author_books] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, "title summary").exec(),
    ]);

    if(author === null) {
        //no results

        res.redirect("/catalog/authors");
    }

    res.render("author_delete", {
        title: "Author ",
        author: author,
        author_books: author_books,
    });
});

// Handle Author delete on POST.

exports.author_delete_post = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)

    const [author, author_books] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({author: req.params.id}, "title summary").exec(),
    ]);

    if(author_books.length > 0) {

        res.render("author_delete", {
            title: "Author ",
            author: author,
            author_books: author_books,
        });
        return;
    } else {
        await Author.findByIdAndDelete(req.body.authorid);
        res.redirect("/catalog/authors");
    }

});

const debug = require("debug")("author");

// Display Author update form on GET.

exports.author_update_get = asyncHandler(async (req, res, next) => {
    const author = await Author.findById(req.params.id).exec();

    if(author === null) {
        debug(`id not found on update: ${req.params.id}`);
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }

    
    res.render("author_form", {
        title: "Update Author",
        author: author,
    });
});

// Handle Author update on POST.

exports.author_update_post = [
    body("first_name")
        .trim()
        .isLength({min : 1})
        .escape()
        .withMessage("first anme msut be Specified")
        .isAlpha()
        .withMessage("First name has non-alphanumberic Characters"),

    body("family_name")
        .trim()
        .isLength({min : 1})
        .escape()
        .withMessage("Family name must be specified")
        .isAlpha()
        .withMessage("Family name has non-alphanumric Characters."),
    
    body("date_of_birth", "Invalid date of Birth")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),

    body("date_of_deadth", "Invalid date of Deadth")
        .optional({values : "falsy"})
        .isISO8601()
        .toDate(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        const author = new Author({
            first_name: req.body.first_name,
            surname: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_deadth,
            _id : req.params.id,
        });

        if(!errors.isEmpty()) {
            res.render("author_form", {
                title: "Update Author",
                author: author,
                errors: errors.array(),
            });
            return;
        } else {
            const updateAuthor = await Author.findByIdAndUpdate(req.params.id,author,{});
            //Redirect to new author record
            res.redirect(updateAuthor.url);

        }

    }),


];





