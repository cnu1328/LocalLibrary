
const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const Book = require("../models/book");

//// Display list of all BookInstances.

exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBookInstances = await 
        BookInstance.find().populate('book').exec();

    res.render('bookinstance_list', {
        title: "Book Instance List",
        bookinstance_list: allBookInstances,
    });

    
});

// Display detail page for a specific BookInstance.

exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
    const bookInstanceDetail = await BookInstance.findById(req.params.id)
        .populate('book').exec();

    if (bookInstanceDetail === null) {
        // No results.
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
    }

    res.render("book_instance_detail", {
        id : req.params.id,
        book_instance_detail: bookInstanceDetail,
    });
});

// Display BookInstance create form on GET.

exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const books = await Book.find({}, 'title').sort({title : 1}).exec(); 
    res.render("book_instance_form", {
        title: "Create BookInstance",
        books: books,
    });
});

//Handle BookInstance create on POST

exports.bookinstance_create_post = [
    body("book", "Book must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),

    body("imprint", "Imprint must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),

    body("status").escape(),
    body("due_back", "Invalid Date")
        .optional({values: 'falsy'})
        .isISO8601()
        .toDate(),
    // Process request after validation and sanitization.

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if(!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.

            const allBooks = await Book.find({}, "title").sort({title: 1}).exec();

            res.render("book_instance_form",{
                title : "Create BookInstance",
                selected_book : bookInstance.book._id,
                books : allBooks,
                bookinstance : bookInstance,
                errors: errors.array(),
            });

            return;
        } else {
            await bookInstance.save();
            res.redirect(bookInstance.url);
        }
    }),
];

// Display BookInstance delete form on GET.

exports.bookinstance_delete_get = (req, res, next) => {
    res.render("bookinstance_delete", {
        title: "Delete Book Instance",
        genreid: req.params.id,
    });
}


// Display BookInstance delete form on post.

exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    const genreid = req.body.genreid;
    await BookInstance.findByIdAndDelete(genreid);

    res.redirect("/catalog/bookinstances")
});

// Display BookInstance update form on GET.

exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    const [allBooks, bookInstance] = await Promise.all([
        Book.find({}, "title").sort({title: 1}).exec(),
        BookInstance.findById(req.params.id).populate('book').exec(),
    ]);

    if (bookInstance === null) {
        // No results.
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
    

    res.render("book_instance_form", {
        title: "Update Book Instance",
        selected_book: bookInstance.book._id,
        books: allBooks,
        bookinstance: bookInstance,
    });
});

// Display BookInstance update form on POST.

exports.bookinstance_update_post = [
    body("book", "Book Must be Specified")
        .trim()
        .isLength({min: 1})
        .escape(),
    
    body("imprint", "Imprint must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),

    body("due_back", "Invalid Date")
        .optional({values: "falsy"})
        .isISO8601()
        .toDate(),

    asyncHandler( async(req, res, next) => {
        const errors = validationResult(req);

        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id,
        });

        if(!errors.isEmpty()) {
            const allBooks = await Book.find({}, 'title').sort({title: 1}).exec();

            res.render("book_instance_form", {
                title: "Update Book Instance",
                selected_book : bookInstance.book._id,
                books: allBooks,
                bookinstance: bookInstance,
                errors: errors.array(),

            });
            return;
        }

        else {
            await BookInstance.findByIdAndUpdate(req.params.id, bookInstance, {});
            res.redirect(bookInstance.url);
        }

    }),
];


